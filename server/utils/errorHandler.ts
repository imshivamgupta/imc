import type { ApiResponse, ValidationError } from "../types";

export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "ApiError";
  }
}

export const ErrorHandler = {
  /**
   * Create a standardized error response
   */
  createErrorResponse(error: unknown): ApiResponse {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (error instanceof Error) {
      // PostgreSQL error handling
      if ("code" in error) {
        const pgError = error as Error & { code: string; detail?: string };
        switch (pgError.code) {
          case "23505": // Unique violation
            return {
              success: false,
              error: "Email already exists",
            };
          case "23502": // Not null violation
            return {
              success: false,
              error: "Required field is missing",
            };
          case "22P02": // Invalid input syntax
            return {
              success: false,
              error: "Invalid data format",
            };
          default:
            console.error("Database error:", pgError);
            return {
              success: false,
              error: "Database operation failed",
            };
        }
      }

      return {
        success: false,
        error: error.message,
      };
    }

    console.error("Unknown error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  },

  /**
   * Create validation error response
   */
  createValidationErrorResponse(errors: ValidationError[]): ApiResponse {
    return {
      success: false,
      error: "Validation failed",
      data: { validationErrors: errors },
    };
  },

  /**
   * Create success response
   */
  createSuccessResponse<T>(data?: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  },

  /**
   * Handle async errors in API routes
   */
  asyncHandler<T>(fn: (event: T) => Promise<ApiResponse>) {
    return async (event: T) => {
      try {
        return await fn(event);
      } catch (error) {
        return this.createErrorResponse(error);
      }
    };
  },
};
