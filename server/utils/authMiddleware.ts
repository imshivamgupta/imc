import { AuthService } from "../services/authService";
import type { PublicUser } from "../types";

// Extend the H3Event type to include user
declare module "h3" {
  interface H3EventContext {
    user?: PublicUser;
  }
}

/**
 * Authentication middleware to verify JWT tokens
 */
export async function authMiddleware(event: any): Promise<PublicUser | null> {
  try {
    // Get token from Authorization header
    const authHeader = getHeader(event, "authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const payload = AuthService.verifyToken(token);

    if (!payload.userId) {
      return null;
    }

    // Get user from database
    const user = await AuthService.getUserById(payload.userId);

    if (!user) {
      return null;
    }

    // Attach user to event context
    event.context.user = user;

    return user;
  } catch {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Require authentication middleware - throws error if not authenticated
 */
export async function requireAuth(event: any): Promise<PublicUser> {
  const user = await authMiddleware(event);

  if (!user) {
    setResponseStatus(event, 401);
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  return user;
}

/**
 * Optional authentication middleware - sets user if authenticated
 */
export async function optionalAuth(event: any): Promise<PublicUser | null> {
  return await authMiddleware(event);
}

/**
 * Check if user owns resource or is admin
 */
export function checkResourceOwnership(
  user: PublicUser,
  resourceUserId: number
): boolean {
  return user.id === resourceUserId;
}

/**
 * Rate limiting helper (basic implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean old entries
  for (const [key, data] of rateLimitMap.entries()) {
    if (data.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }

  const current = rateLimitMap.get(identifier);

  if (!current) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now });
    return true;
  }

  if (current.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

/**
 * Get client IP for rate limiting
 */
export function getClientIP(event: any): string {
  const forwarded = getHeader(event, "x-forwarded-for");
  const realIp = getHeader(event, "x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  return "unknown";
}
