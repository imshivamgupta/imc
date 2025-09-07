import { ErrorHandler } from "../../utils/errorHandler";
import { authenticate } from "../../utils/authMiddleware";
import {
  getPageBySlug,
  updatePage,
  deletePage,
} from "../../services/pageService";
import { ValidationService } from "../../utils/validation";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);
    const slug = getRouterParam(event, "slug");

    if (!slug) {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(
        new Error("Page slug is required")
      );
    }

    if (method === "GET") {
      // Get page by slug
      try {
        const page = await getPageBySlug(slug);

        if (!page) {
          setResponseStatus(event, 404);
          return ErrorHandler.createErrorResponse(new Error("Page not found"));
        }

        // Check if page is public or user is the owner
        const authResult = await authenticate(event, false); // Don't require auth for public pages
        const isOwner =
          authResult.success && authResult.user?.id === page.owner_id;
        const canView = page.is_public || isOwner;

        if (!canView) {
          setResponseStatus(event, 403);
          return ErrorHandler.createErrorResponse(
            new Error("You don't have permission to view this page")
          );
        }

        return ErrorHandler.createSuccessResponse(
          {
            ...page,
            can_edit: isOwner,
          },
          "Page retrieved successfully"
        );
      } catch (error) {
        setResponseStatus(event, 500);
        return ErrorHandler.createErrorResponse(error);
      }
    } else if (method === "PUT") {
      // Update page (only by owner)
      const authResult = await authenticate(event);
      if (!authResult.success) {
        setResponseStatus(event, 401);
        return ErrorHandler.createErrorResponse(
          new Error("Authentication required")
        );
      }

      // First, get the page to verify ownership and get the ID
      const existingPage = await getPageBySlug(slug);
      if (!existingPage) {
        setResponseStatus(event, 404);
        return ErrorHandler.createErrorResponse(new Error("Page not found"));
      }

      if (existingPage.owner_id !== authResult.user!.id) {
        setResponseStatus(event, 403);
        return ErrorHandler.createErrorResponse(
          new Error("You don't have permission to edit this page")
        );
      }

      const body = await readBody(event);
      const validation = ValidationService.validateUpdatePage(body);

      if (!validation.isValid) {
        setResponseStatus(event, 400);
        return ErrorHandler.createValidationErrorResponse(validation.errors);
      }

      try {
        const updatedPage = await updatePage(
          existingPage.id,
          authResult.user!.id,
          body
        );

        return ErrorHandler.createSuccessResponse(
          updatedPage,
          "Page updated successfully"
        );
      } catch (error) {
        setResponseStatus(event, 500);
        return ErrorHandler.createErrorResponse(error);
      }
    } else if (method === "DELETE") {
      // Delete page (only by owner)
      const authResult = await authenticate(event);
      if (!authResult.success) {
        setResponseStatus(event, 401);
        return ErrorHandler.createErrorResponse(
          new Error("Authentication required")
        );
      }

      // First, get the page to verify ownership and get the ID
      const existingPage = await getPageBySlug(slug);
      if (!existingPage) {
        setResponseStatus(event, 404);
        return ErrorHandler.createErrorResponse(new Error("Page not found"));
      }

      if (existingPage.owner_id !== authResult.user!.id) {
        setResponseStatus(event, 403);
        return ErrorHandler.createErrorResponse(
          new Error("You don't have permission to delete this page")
        );
      }

      try {
        const deleted = await deletePage(existingPage.id, authResult.user!.id);

        if (!deleted) {
          setResponseStatus(event, 500);
          return ErrorHandler.createErrorResponse(
            new Error("Failed to delete page")
          );
        }

        return ErrorHandler.createSuccessResponse(
          null,
          "Page deleted successfully"
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
