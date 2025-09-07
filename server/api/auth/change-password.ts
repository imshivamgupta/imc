import { AuthService } from "../../services/authService";
import { ValidationService } from "../../utils/validation";
import { ErrorHandler } from "../../utils/errorHandler";
import { requireAuth } from "../../utils/authMiddleware";
import type { ChangePasswordRequest } from "../../types";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    if (method !== "POST") {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }

    // Require authentication
    const currentUser = await requireAuth(event);

    const body = await readBody(event);

    // Validate input
    const validation = ValidationService.validatePasswordChange(body);
    if (!validation.isValid) {
      setResponseStatus(event, 400);
      return ErrorHandler.createValidationErrorResponse(validation.errors);
    }

    const passwordData = body as ChangePasswordRequest;

    try {
      // Change password
      await AuthService.changePassword(currentUser.id, passwordData);

      return ErrorHandler.createSuccessResponse(
        null,
        "Password changed successfully. Please log in again."
      );
    } catch (changeError) {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(changeError);
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
