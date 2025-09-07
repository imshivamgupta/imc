import { AuthService } from "../../services/authService";
import { ErrorHandler } from "../../utils/errorHandler";
import { requireAuth } from "../../utils/authMiddleware";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    if (method !== "POST") {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }

    // Require authentication
    await requireAuth(event);

    const body = await readBody(event);
    const { refreshToken } = body;

    if (!refreshToken || typeof refreshToken !== "string") {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(
        new Error("Refresh token is required")
      );
    }

    // Logout (remove refresh token)
    await AuthService.logout(refreshToken);

    return ErrorHandler.createSuccessResponse(null, "Logged out successfully");
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
