import { UserService } from "../services/userService";
import { ValidationService } from "../utils/validation";
import { ErrorHandler } from "../utils/errorHandler";
import type { CreateUserRequest } from "../types";

export default defineEventHandler(async (event) => {
  try {
    // Initialize table on first request
    await UserService.initializeTable();

    const method = event.method;

    if (method === "POST") {
      // Create new user
      const body = await readBody(event);

      // Validate input
      const validation = ValidationService.validateCreateUser(body);
      if (!validation.isValid) {
        setResponseStatus(event, 400);
        return ErrorHandler.createValidationErrorResponse(validation.errors);
      }

      // Check if email already exists
      const emailExists = await UserService.emailExists(body.email);
      if (emailExists) {
        setResponseStatus(event, 409);
        return ErrorHandler.createErrorResponse(
          new Error("Email already exists")
        );
      }

      const user = await UserService.createUser(body as CreateUserRequest);
      setResponseStatus(event, 201);
      return ErrorHandler.createSuccessResponse(
        user,
        "User created successfully"
      );
    } else if (method === "GET") {
      // Get all users with optional pagination
      const query = getQuery(event);
      const options = {
        limit: query.limit ? parseInt(query.limit as string) : undefined,
        offset: query.offset ? parseInt(query.offset as string) : undefined,
        orderBy: (query.orderBy as string) || "created_at",
        orderDirection: (query.orderDirection as "ASC" | "DESC") || "DESC",
      };

      const result = await UserService.getAllUsers(options);
      return ErrorHandler.createSuccessResponse(result);
    } else if (method === "DELETE") {
      // Delete user by ID
      const query = getQuery(event);
      const userIdValidation = ValidationService.validateUserId(
        query.id as string
      );

      if (!userIdValidation.isValid) {
        setResponseStatus(event, 400);
        return ErrorHandler.createValidationErrorResponse(
          userIdValidation.errors
        );
      }

      const userId = parseInt(query.id as string);
      const deletedUser = await UserService.deleteUser(userId);

      if (!deletedUser) {
        setResponseStatus(event, 404);
        return ErrorHandler.createErrorResponse(new Error("User not found"));
      }

      return ErrorHandler.createSuccessResponse(
        deletedUser,
        "User deleted successfully"
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
