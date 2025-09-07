import { ValidationService } from "../../utils/validation";
import { ErrorHandler } from "../../utils/errorHandler";
import { requireAuth } from "../../utils/authMiddleware";
import { UserService } from "../../services/userService";
import type { UpdateUserRequest } from "../../types";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    // Require authentication for all methods
    const currentUser = await requireAuth(event);

    if (method === "GET") {
      // Get current user profile
      return ErrorHandler.createSuccessResponse(
        currentUser,
        "Profile retrieved successfully"
      );
    } else if (method === "PUT") {
      // Update current user profile
      const body = await readBody(event);

      // Validate input
      const validation = ValidationService.validateUpdateUser(body);
      if (!validation.isValid) {
        setResponseStatus(event, 400);
        return ErrorHandler.createValidationErrorResponse(validation.errors);
      }

      // Check if email already exists (excluding current user)
      if (body.email && body.email !== currentUser.email) {
        const emailExists = await UserService.emailExists(
          body.email,
          currentUser.id
        );
        if (emailExists) {
          setResponseStatus(event, 409);
          return ErrorHandler.createErrorResponse(
            new Error("Email already exists")
          );
        }
      }

      const updatedUser = await UserService.updateUser(
        currentUser.id,
        body as UpdateUserRequest
      );

      if (!updatedUser) {
        setResponseStatus(event, 404);
        return ErrorHandler.createErrorResponse(new Error("User not found"));
      }

      return ErrorHandler.createSuccessResponse(
        updatedUser,
        "Profile updated successfully"
      );
    } else {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
