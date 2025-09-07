import { AuthService } from "../../services/authService";
import { UserService } from "../../services/userService";
import { ValidationService } from "../../utils/validation";
import { ErrorHandler } from "../../utils/errorHandler";
import { rateLimit, getClientIP } from "../../utils/authMiddleware";
import type { RegisterRequest } from "../../types";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    if (method !== "POST") {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }

    // Rate limiting
    const clientIP = getClientIP(event);
    if (!rateLimit(`register:${clientIP}`, 5, 15 * 60 * 1000)) {
      // 5 attempts per 15 minutes
      setResponseStatus(event, 429);
      return ErrorHandler.createErrorResponse(
        new Error("Too many registration attempts. Please try again later.")
      );
    }

    const body = await readBody(event);

    // Validate input
    const validation = ValidationService.validateRegister(body);
    if (!validation.isValid) {
      setResponseStatus(event, 400);
      return ErrorHandler.createValidationErrorResponse(validation.errors);
    }

    const userData = body as RegisterRequest;

    // Check if email already exists
    const emailExists = await UserService.emailExists(userData.email);
    if (emailExists) {
      setResponseStatus(event, 409);
      return ErrorHandler.createErrorResponse(
        new Error("Email already exists")
      );
    }

    // Register user
    const authResponse = await AuthService.register(userData);

    setResponseStatus(event, 201);
    return ErrorHandler.createSuccessResponse(
      authResponse,
      "User registered successfully"
    );
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
