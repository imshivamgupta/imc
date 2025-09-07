import { AuthService } from "../../services/authService";
import { ValidationService } from "../../utils/validation";
import { ErrorHandler } from "../../utils/errorHandler";
import { rateLimit, getClientIP } from "../../utils/authMiddleware";
import type { ConfirmResetPasswordRequest } from "../../types";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    if (method !== "POST") {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }

    // Rate limiting
    const clientIP = getClientIP(event);
    if (!rateLimit(`reset_password:${clientIP}`, 5, 15 * 60 * 1000)) {
      // 5 attempts per 15 minutes
      setResponseStatus(event, 429);
      return ErrorHandler.createErrorResponse(
        new Error("Too many password reset attempts. Please try again later.")
      );
    }

    const body = await readBody(event);

    // Validate input
    const validation = ValidationService.validatePasswordResetConfirm(body);
    if (!validation.isValid) {
      setResponseStatus(event, 400);
      return ErrorHandler.createValidationErrorResponse(validation.errors);
    }

    const resetData = body as ConfirmResetPasswordRequest;

    try {
      // Reset password
      await AuthService.resetPassword(resetData);

      return ErrorHandler.createSuccessResponse(
        null,
        "Password reset successfully. Please log in with your new password."
      );
    } catch (resetError) {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(resetError);
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
