import { ErrorHandler } from "../utils/errorHandler";
import { authenticate } from "../utils/authMiddleware";
import {
  createPage,
  getPublicPages,
  getPagesByOwner,
  searchPages,
  isSlugAvailable,
} from "../services/pageService";
import { ValidationService } from "../utils/validation";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    if (method === "GET") {
      // Get pages with optional search and filtering
      const queryParams = getQuery(event);
      const {
        page = "1",
        limit = "10",
        search,
        my_pages = "false",
      } = queryParams as Record<string, string>;

      // Validate query parameters
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);

      if (isNaN(pageNum) || pageNum < 1) {
        setResponseStatus(event, 400);
        return ErrorHandler.createErrorResponse(
          new Error("Page must be a positive integer")
        );
      }

      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        setResponseStatus(event, 400);
        return ErrorHandler.createErrorResponse(
          new Error("Limit must be between 1 and 100")
        );
      }

      const offset = (pageNum - 1) * limitNum;
      const myPages = my_pages === "true";

      try {
        if (search && typeof search === "string") {
          // Search functionality
          let ownerId: number | undefined;
          if (myPages) {
            const authResult = await authenticate(event);
            if (!authResult.success) {
              setResponseStatus(event, 401);
              return ErrorHandler.createErrorResponse(
                new Error("Authentication required for searching your pages")
              );
            }
            ownerId = authResult.user!.id;
          }

          const result = await searchPages(search, myPages, ownerId, {
            limit: limitNum,
            offset,
          });

          return ErrorHandler.createSuccessResponse(
            {
              pages: result.pages,
              pagination: {
                page: pageNum,
                limit: limitNum,
                total: result.total,
                totalPages: Math.ceil(result.total / limitNum),
              },
            },
            "Pages retrieved successfully"
          );
        } else if (myPages) {
          // Get user's own pages
          const authResult = await authenticate(event);
          if (!authResult.success) {
            setResponseStatus(event, 401);
            return ErrorHandler.createErrorResponse(
              new Error("Authentication required")
            );
          }

          const result = await getPagesByOwner(authResult.user!.id, {
            limit: limitNum,
            offset,
          });

          return ErrorHandler.createSuccessResponse(
            {
              pages: result.pages,
              pagination: {
                page: pageNum,
                limit: limitNum,
                total: result.total,
                totalPages: Math.ceil(result.total / limitNum),
              },
            },
            "Your pages retrieved successfully"
          );
        } else {
          // Get public pages
          const result = await getPublicPages({
            limit: limitNum,
            offset,
          });

          return ErrorHandler.createSuccessResponse(
            {
              pages: result.pages,
              pagination: {
                page: pageNum,
                limit: limitNum,
                total: result.total,
                totalPages: Math.ceil(result.total / limitNum),
              },
            },
            "Public pages retrieved successfully"
          );
        }
      } catch (error) {
        setResponseStatus(event, 500);
        return ErrorHandler.createErrorResponse(error);
      }
    } else if (method === "POST") {
      // Create a new page
      const authResult = await authenticate(event);
      if (!authResult.success) {
        setResponseStatus(event, 401);
        return ErrorHandler.createErrorResponse(
          new Error("Authentication required")
        );
      }

      const body = await readBody(event);
      const validation = ValidationService.validateCreatePage(body);

      if (!validation.isValid) {
        setResponseStatus(event, 400);
        return ErrorHandler.createValidationErrorResponse(validation.errors);
      }

      try {
        // Check if slug is available
        const slugAvailable = await isSlugAvailable(body.slug);

        if (!slugAvailable) {
          setResponseStatus(event, 409);
          return ErrorHandler.createErrorResponse(
            new Error("Slug already exists. Please choose a different slug.")
          );
        }

        const page = await createPage(authResult.user!.id, body);

        setResponseStatus(event, 201);
        return ErrorHandler.createSuccessResponse(
          page,
          "Page created successfully"
        );
      } catch (error) {
        setResponseStatus(event, 500);
        return ErrorHandler.createErrorResponse(error);
      }
    } else {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
