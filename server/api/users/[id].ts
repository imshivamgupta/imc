import { UserService } from "../../services/userService";
import { ValidationService } from "../../utils/validation";
import { ErrorHandler } from "../../utils/errorHandler";
import type { UpdateUserRequest } from "../../types";

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, "id");
    const method = getMethod(event, "GET");

    // Validate user ID
    const userIdValidation = ValidationService.validateUserId(userId);
    if (!userIdValidation.isValid) {
      setResponseStatus(event, 400);
      return ErrorHandler.createValidationErrorResponse(
        userIdValidation.errors
      );
    }

    const id = parseInt(userId!);

    if (method === "GET") {
      // Get user by ID
      const user = await UserService.getUserById(id);

      if (!user) {
        setResponseStatus(event, 404);
        return ErrorHandler.createErrorResponse(new Error("User not found"));
      }

      return ErrorHandler.createSuccessResponse(user);
    } else if (method === "PUT") {
      // Update user by ID
      const body = await readBody(event);

      // Validate input
      const validation = ValidationService.validateUpdateUser(body);
      if (!validation.isValid) {
        setResponseStatus(event, 400);
        return ErrorHandler.createValidationErrorResponse(validation.errors);
      }

      // Check if email already exists (excluding current user)
      if (body.email) {
        const emailExists = await UserService.emailExists(body.email, id);
        if (emailExists) {
          setResponseStatus(event, 409);
          return ErrorHandler.createErrorResponse(
            new Error("Email already exists")
          );
        }
      }

      const updatedUser = await UserService.updateUser(
        id,
        body as UpdateUserRequest
      );

      if (!updatedUser) {
        setResponseStatus(event, 404);
        return ErrorHandler.createErrorResponse(new Error("User not found"));
      }

      return ErrorHandler.createSuccessResponse(
        updatedUser,
        "User updated successfully"
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
