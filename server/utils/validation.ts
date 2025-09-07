import type {
  CreateUserRequest,
  UpdateUserRequest,
  RegisterRequest,
  LoginRequest,
  ResetPasswordRequest,
  ConfirmResetPasswordRequest,
  ChangePasswordRequest,
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

    // Validate image_path (optional)
    if (user.image_path !== undefined) {
      if (typeof user.image_path !== "string") {
        errors.push({
          field: "image_path",
          message: "Image path must be a string",
        });
      } else if (user.image_path.length > 255) {
        errors.push({
          field: "image_path",
          message: "Image path must be less than 255 characters",
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
      user.phone === undefined &&
      user.image_path === undefined
    ) {
      errors.push({
        field: "body",
        message:
          "At least one field (name, email, age, phone, or image_path) must be provided",
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

    // Validate image_path if provided
    if (user.image_path !== undefined) {
      if (typeof user.image_path !== "string") {
        errors.push({
          field: "image_path",
          message: "Image path must be a string",
        });
      } else if (user.image_path.length > 255) {
        errors.push({
          field: "image_path",
          message: "Image path must be less than 255 characters",
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

  /**
   * Check if password is strong enough
   */
  isStrongPassword(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  /**
   * Validate user registration data
   */
  validateRegister(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      errors.push({ field: "body", message: "Request body is required" });
      return { isValid: false, errors };
    }

    const user = data as RegisterRequest;

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

    // Validate password
    if (!user.password || typeof user.password !== "string") {
      errors.push({
        field: "password",
        message: "Password is required and must be a string",
      });
    } else if (!this.isStrongPassword(user.password)) {
      errors.push({
        field: "password",
        message:
          "Password must be at least 8 characters with uppercase, lowercase, and number",
      });
    }

    // Validate confirmPassword
    if (!user.confirmPassword || typeof user.confirmPassword !== "string") {
      errors.push({
        field: "confirmPassword",
        message: "Password confirmation is required",
      });
    } else if (user.password !== user.confirmPassword) {
      errors.push({
        field: "confirmPassword",
        message: "Passwords do not match",
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
   * Validate user login data
   */
  validateLogin(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      errors.push({ field: "body", message: "Request body is required" });
      return { isValid: false, errors };
    }

    const credentials = data as LoginRequest;

    // Validate email
    if (!credentials.email || typeof credentials.email !== "string") {
      errors.push({
        field: "email",
        message: "Email is required and must be a string",
      });
    } else if (!this.isValidEmail(credentials.email)) {
      errors.push({
        field: "email",
        message: "Email must be a valid email address",
      });
    }

    // Validate password
    if (!credentials.password || typeof credentials.password !== "string") {
      errors.push({
        field: "password",
        message: "Password is required and must be a string",
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validate password reset request
   */
  validatePasswordResetRequest(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      errors.push({ field: "body", message: "Request body is required" });
      return { isValid: false, errors };
    }

    const request = data as ResetPasswordRequest;

    // Validate email
    if (!request.email || typeof request.email !== "string") {
      errors.push({
        field: "email",
        message: "Email is required and must be a string",
      });
    } else if (!this.isValidEmail(request.email)) {
      errors.push({
        field: "email",
        message: "Email must be a valid email address",
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validate password reset confirmation
   */
  validatePasswordResetConfirm(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      errors.push({ field: "body", message: "Request body is required" });
      return { isValid: false, errors };
    }

    const request = data as ConfirmResetPasswordRequest;

    // Validate token
    if (!request.token || typeof request.token !== "string") {
      errors.push({
        field: "token",
        message: "Reset token is required and must be a string",
      });
    }

    // Validate password
    if (!request.password || typeof request.password !== "string") {
      errors.push({
        field: "password",
        message: "Password is required and must be a string",
      });
    } else if (!this.isStrongPassword(request.password)) {
      errors.push({
        field: "password",
        message:
          "Password must be at least 8 characters with uppercase, lowercase, and number",
      });
    }

    // Validate confirmPassword
    if (
      !request.confirmPassword ||
      typeof request.confirmPassword !== "string"
    ) {
      errors.push({
        field: "confirmPassword",
        message: "Password confirmation is required",
      });
    } else if (request.password !== request.confirmPassword) {
      errors.push({
        field: "confirmPassword",
        message: "Passwords do not match",
      });
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Validate password change request
   */
  validatePasswordChange(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      errors.push({ field: "body", message: "Request body is required" });
      return { isValid: false, errors };
    }

    const request = data as ChangePasswordRequest;

    // Validate current password
    if (
      !request.currentPassword ||
      typeof request.currentPassword !== "string"
    ) {
      errors.push({
        field: "currentPassword",
        message: "Current password is required and must be a string",
      });
    }

    // Validate new password
    if (!request.newPassword || typeof request.newPassword !== "string") {
      errors.push({
        field: "newPassword",
        message: "New password is required and must be a string",
      });
    } else if (!this.isStrongPassword(request.newPassword)) {
      errors.push({
        field: "newPassword",
        message:
          "Password must be at least 8 characters with uppercase, lowercase, and number",
      });
    }

    // Validate confirmPassword
    if (
      !request.confirmPassword ||
      typeof request.confirmPassword !== "string"
    ) {
      errors.push({
        field: "confirmPassword",
        message: "Password confirmation is required",
      });
    } else if (request.newPassword !== request.confirmPassword) {
      errors.push({
        field: "confirmPassword",
        message: "Passwords do not match",
      });
    }

    // Check if new password is different from current
    if (request.currentPassword === request.newPassword) {
      errors.push({
        field: "newPassword",
        message: "New password must be different from current password",
      });
    }

    return { isValid: errors.length === 0, errors };
  },
};
