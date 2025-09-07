// Example implementation structure for Authentication APIs

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  email_verified: boolean;
  reset_token?: string;
  reset_token_expires?: Date;
  last_login?: Date;
  created_at: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: Omit<AuthUser, "password_hash">;
  token: string;
  refreshToken: string;
}

// Database migration for auth
// ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
// ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
// ALTER TABLE users ADD COLUMN reset_token VARCHAR(255);
// ALTER TABLE users ADD COLUMN reset_token_expires TIMESTAMP;
// ALTER TABLE users ADD COLUMN last_login TIMESTAMP;

// CREATE TABLE refresh_tokens (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   token VARCHAR(255) NOT NULL,
//   expires_at TIMESTAMP NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
