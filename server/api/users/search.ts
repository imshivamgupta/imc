import { UserService } from "../../services/userService";
import { ErrorHandler } from "../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    if (!query.search || typeof query.search !== "string") {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(
        new Error("Search term is required")
      );
    }

    const searchTerm = query.search.trim();
    if (searchTerm.length < 2) {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(
        new Error("Search term must be at least 2 characters")
      );
    }

    const users = await UserService.searchUsers(searchTerm);
    return ErrorHandler.createSuccessResponse({ users, total: users.length });
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
