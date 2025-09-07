import { AuthService } from "../../services/authService";
import { ValidationService } from "../../utils/validation";
import { ErrorHandler } from "../../utils/errorHandler";
import { rateLimit, getClientIP } from "../../utils/authMiddleware";
import type { LoginRequest } from "../../types";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    if (method !== "POST") {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }

    // Rate limiting
    const clientIP = getClientIP(event);
    if (!rateLimit(`login:${clientIP}`, 10, 15 * 60 * 1000)) {
      // 10 attempts per 15 minutes
      setResponseStatus(event, 429);
      return ErrorHandler.createErrorResponse(
        new Error("Too many login attempts. Please try again later.")
      );
    }

    const body = await readBody(event);

    // Validate input
    const validation = ValidationService.validateLogin(body);
    if (!validation.isValid) {
      setResponseStatus(event, 400);
      return ErrorHandler.createValidationErrorResponse(validation.errors);
    }

    const credentials = body as LoginRequest;

    try {
      // Attempt login
      const authResponse = await AuthService.login(credentials);

      return ErrorHandler.createSuccessResponse(
        authResponse,
        "Login successful"
      );
    } catch (loginError) {
      // Add additional rate limiting for failed login attempts
      if (!rateLimit(`failed_login:${clientIP}`, 3, 5 * 60 * 1000)) {
        // 3 failed attempts per 5 minutes
        setResponseStatus(event, 429);
        return ErrorHandler.createErrorResponse(
          new Error("Too many failed login attempts. Please try again later.")
        );
      }

      setResponseStatus(event, 401);
      return ErrorHandler.createErrorResponse(
        new Error("Invalid email or password")
      );
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
