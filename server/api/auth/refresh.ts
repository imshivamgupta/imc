import { AuthService } from "../../services/authService";
import { ErrorHandler } from "../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    if (method !== "POST") {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }

    const body = await readBody(event);
    const { refreshToken } = body;

    if (!refreshToken || typeof refreshToken !== "string") {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(
        new Error("Refresh token is required")
      );
    }

    try {
      // Refresh tokens
      const authResponse = await AuthService.refreshToken(refreshToken);

      return ErrorHandler.createSuccessResponse(
        authResponse,
        "Tokens refreshed successfully"
      );
    } catch (refreshError) {
      setResponseStatus(event, 401);
      return ErrorHandler.createErrorResponse(
        new Error("Invalid or expired refresh token")
      );
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
