// Database model interfaces
export interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  age?: number;
  phone?: string;
  image_path?: string;
  created_at: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age?: number;
  phone?: string;
  image_path?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
  phone?: string;
  image_path?: string;
}

// API Response interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page?: number;
  limit?: number;
}

// Database operation interfaces
export interface DatabaseError {
  code: string;
  message: string;
  detail?: string;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}

// Validation schemas
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
