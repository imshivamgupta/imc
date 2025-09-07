import { AuthService } from "../../services/authService";
import { ValidationService } from "../../utils/validation";
import { ErrorHandler } from "../../utils/errorHandler";
import { rateLimit, getClientIP } from "../../utils/authMiddleware";
import type { ResetPasswordRequest } from "../../types";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    if (method !== "POST") {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }

    // Rate limiting
    const clientIP = getClientIP(event);
    if (!rateLimit(`forgot_password:${clientIP}`, 3, 15 * 60 * 1000)) {
      // 3 attempts per 15 minutes
      setResponseStatus(event, 429);
      return ErrorHandler.createErrorResponse(
        new Error("Too many password reset attempts. Please try again later.")
      );
    }

    const body = await readBody(event);

    // Validate input
    const validation = ValidationService.validatePasswordResetRequest(body);
    if (!validation.isValid) {
      setResponseStatus(event, 400);
      return ErrorHandler.createValidationErrorResponse(validation.errors);
    }

    const resetData = body as ResetPasswordRequest;

    // Request password reset (always return success for security)
    await AuthService.requestPasswordReset(resetData);

    return ErrorHandler.createSuccessResponse(
      null,
      "If the email exists, a password reset link has been sent."
    );
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
