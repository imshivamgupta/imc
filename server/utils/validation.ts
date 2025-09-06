import type {
  CreateUserRequest,
  UpdateUserRequest,
  ValidationResult,
  ValidationError,
} from "../types";

export const ValidationService = {
  /**
   * Validate user creation data
   */
  validateCreateUser(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      errors.push({ field: "body", message: "Request body is required" });
      return { isValid: false, errors };
    }

    const user = data as CreateUserRequest;

    // Validate name
    if (
      !user.name ||
      typeof user.name !== "string" ||
      user.name.trim().length === 0
    ) {
      errors.push({
        field: "name",
        message: "Name is required and must be a non-empty string",
      });
    } else if (user.name.length > 100) {
      errors.push({
        field: "name",
        message: "Name must be less than 100 characters",
      });
    }

    // Validate email
    if (!user.email || typeof user.email !== "string") {
      errors.push({
        field: "email",
        message: "Email is required and must be a string",
      });
    } else if (!this.isValidEmail(user.email)) {
      errors.push({
        field: "email",
        message: "Email must be a valid email address",
      });
    } else if (user.email.length > 100) {
      errors.push({
        field: "email",
        message: "Email must be less than 100 characters",
      });
    }

    // Validate age (optional)
    if (user.age !== undefined) {
      if (typeof user.age !== "number" || !Number.isInteger(user.age)) {
        errors.push({ field: "age", message: "Age must be an integer" });
      } else if (user.age < 0 || user.age > 150) {
        errors.push({ field: "age", message: "Age must be between 0 and 150" });
      }
    }

    // Validate phone (optional)
    if (user.phone !== undefined) {
      if (typeof user.phone !== "string") {
        errors.push({ field: "phone", message: "Phone must be a string" });
      } else if (user.phone.length > 20) {
        errors.push({
          field: "phone",
          message: "Phone must be less than 20 characters",
        });
      }
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validate user update data
   */
  validateUpdateUser(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      errors.push({ field: "body", message: "Request body is required" });
      return { isValid: false, errors };
    }

    const user = data as UpdateUserRequest;

    // At least one field must be provided
    if (
      !user.name &&
      !user.email &&
      user.age === undefined &&
      user.phone === undefined
    ) {
      errors.push({
        field: "body",
        message:
          "At least one field (name, email, age, or phone) must be provided",
      });
      return { isValid: false, errors };
    }

    // Validate name if provided
    if (user.name !== undefined) {
      if (typeof user.name !== "string" || user.name.trim().length === 0) {
        errors.push({
          field: "name",
          message: "Name must be a non-empty string",
        });
      } else if (user.name.length > 100) {
        errors.push({
          field: "name",
          message: "Name must be less than 100 characters",
        });
      }
    }

    // Validate email if provided
    if (user.email !== undefined) {
      if (typeof user.email !== "string") {
        errors.push({ field: "email", message: "Email must be a string" });
      } else if (!this.isValidEmail(user.email)) {
        errors.push({
          field: "email",
          message: "Email must be a valid email address",
        });
      } else if (user.email.length > 100) {
        errors.push({
          field: "email",
          message: "Email must be less than 100 characters",
        });
      }
    }

    // Validate age if provided
    if (user.age !== undefined) {
      if (typeof user.age !== "number" || !Number.isInteger(user.age)) {
        errors.push({ field: "age", message: "Age must be an integer" });
      } else if (user.age < 0 || user.age > 150) {
        errors.push({ field: "age", message: "Age must be between 0 and 150" });
      }
    }

    // Validate phone if provided
    if (user.phone !== undefined) {
      if (typeof user.phone !== "string") {
        errors.push({ field: "phone", message: "Phone must be a string" });
      } else if (user.phone.length > 20) {
        errors.push({
          field: "phone",
          message: "Phone must be less than 20 characters",
        });
      }
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validate user ID
   */
  validateUserId(id: string | undefined): ValidationResult {
    const errors: ValidationError[] = [];

    if (!id) {
      errors.push({ field: "id", message: "User ID is required" });
    } else if (!/^\d+$/.test(id)) {
      errors.push({
        field: "id",
        message: "User ID must be a positive integer",
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Check if email is valid
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
};
