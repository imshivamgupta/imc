// Database model interfaces
export interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  age?: number;
  phone?: string;
  image_path?: string;
  password_hash?: string;
  email_verified: boolean;
  reset_token?: string;
  reset_token_expires?: Date;
  last_login?: Date;
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

// Authentication interfaces
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  age?: number;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
  refreshToken: string;
}

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  age?: number;
  phone?: string;
  image_path?: string;
  email_verified: boolean;
  last_login?: Date;
  created_at: Date;
}

export interface RefreshToken extends Record<string, unknown> {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
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

// Page interfaces
export interface Page extends Record<string, unknown> {
  id: number;
  slug: string; // unique parameter for accessing the page
  title: string;
  content: string;
  description?: string;
  is_public: boolean;
  owner_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePageRequest {
  slug: string;
  title: string;
  content: string;
  description?: string;
  is_public?: boolean;
}

export interface UpdatePageRequest {
  title?: string;
  content?: string;
  description?: string;
  is_public?: boolean;
}

export interface PageWithOwner extends Page {
  owner_name: string;
  owner_email: string;
}
