import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../utils/database";
import type {
  User,
  PublicUser,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RefreshToken,
  JWTPayload,
  ResetPasswordRequest,
  ConfirmResetPasswordRequest,
  ChangePasswordRequest,
} from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
const SALT_ROUNDS = 12;

export const AuthService = {
  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  },

  /**
   * Verify a password against hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  },

  /**
   * Generate JWT token
   */
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as string,
    });
  },

  /**
   * Generate refresh token
   */
  generateRefreshToken(): string {
    return jwt.sign({}, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN as string,
    });
  },

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  },

  /**
   * Convert User to PublicUser (remove sensitive fields)
   */
  toPublicUser(user: User): PublicUser {
    const { password_hash, reset_token, reset_token_expires, ...publicUser } =
      user;
    return publicUser as PublicUser;
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { password, confirmPassword, ...userDetails } = userData;

    // Hash password
    const password_hash = await this.hashPassword(password);

    // Create user
    const result = await db.query<User>(
      `INSERT INTO users (name, email, password_hash, age, phone, email_verified) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        userDetails.name,
        userDetails.email,
        password_hash,
        userDetails.age || null,
        userDetails.phone || null,
        false, // email_verified
      ]
    );

    if (result.rows.length === 0) {
      throw new Error("Failed to create user");
    }

    const user = result.rows[0];
    const publicUser = this.toPublicUser(user);

    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = this.generateToken(tokenPayload);
    const refreshToken = this.generateRefreshToken();

    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: publicUser,
      token,
      refreshToken,
    };
  },

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Get user by email
    const result = await db.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      throw new Error("Account not set up for password login");
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(
      password,
      user.password_hash
    );
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    await db.query(
      "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
      [user.id]
    );

    const publicUser = this.toPublicUser(user);

    // Generate tokens
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = this.generateToken(tokenPayload);
    const refreshToken = this.generateRefreshToken();

    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: publicUser,
      token,
      refreshToken,
    };
  },

  /**
   * Store refresh token in database
   */
  async storeRefreshToken(userId: number, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [userId, token, expiresAt]
    );
  },

  /**
   * Refresh JWT token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Verify refresh token
    try {
      this.verifyToken(refreshToken);
    } catch {
      throw new Error("Invalid refresh token");
    }

    // Check if refresh token exists in database
    const tokenResult = await db.query<RefreshToken>(
      `SELECT * FROM refresh_tokens 
       WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP`,
      [refreshToken]
    );

    if (tokenResult.rows.length === 0) {
      throw new Error("Refresh token not found or expired");
    }

    const tokenRecord = tokenResult.rows[0];

    // Get user
    const userResult = await db.query<User>(
      "SELECT * FROM users WHERE id = $1",
      [tokenRecord.user_id]
    );

    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = userResult.rows[0];
    const publicUser = this.toPublicUser(user);

    // Generate new tokens
    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
    };

    const newToken = this.generateToken(tokenPayload);
    const newRefreshToken = this.generateRefreshToken();

    // Delete old refresh token and store new one
    await db.transaction(async (client) => {
      await client.query("DELETE FROM refresh_tokens WHERE token = $1", [
        refreshToken,
      ]);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await client.query(
        "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
        [user.id, newRefreshToken, expiresAt]
      );
    });

    return {
      user: publicUser,
      token: newToken,
      refreshToken: newRefreshToken,
    };
  },

  /**
   * Logout user (delete refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    await db.query("DELETE FROM refresh_tokens WHERE token = $1", [
      refreshToken,
    ]);
  },

  /**
   * Logout from all devices (delete all refresh tokens for user)
   */
  async logoutAll(userId: number): Promise<void> {
    await db.query("DELETE FROM refresh_tokens WHERE user_id = $1", [userId]);
  },

  /**
   * Get user by ID (for middleware)
   */
  async getUserById(id: number): Promise<PublicUser | null> {
    const result = await db.query<User>("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.toPublicUser(result.rows[0]);
  },

  /**
   * Generate password reset token
   */
  async requestPasswordReset(data: ResetPasswordRequest): Promise<void> {
    const { email } = data;

    // Check if user exists
    const userResult = await db.query<User>(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists or not
      return;
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour from now

    // Store reset token
    await db.query(
      `UPDATE users 
       SET reset_token = $1, reset_token_expires = $2 
       WHERE id = $3`,
      [resetToken, expiresAt, user.id]
    );

    // In a real app, you would send an email here
    console.log(`Password reset token for ${email}: ${resetToken}`);
  },

  /**
   * Reset password using token
   */
  async resetPassword(data: ConfirmResetPasswordRequest): Promise<void> {
    const { token, password } = data;

    // Verify reset token
    let decoded: { userId: number };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch {
      throw new Error("Invalid or expired reset token");
    }

    // Get user and verify token
    const userResult = await db.query<User>(
      `SELECT * FROM users 
       WHERE id = $1 AND reset_token = $2 AND reset_token_expires > CURRENT_TIMESTAMP`,
      [decoded.userId, token]
    );

    if (userResult.rows.length === 0) {
      throw new Error("Invalid or expired reset token");
    }

    const user = userResult.rows[0];

    // Hash new password
    const password_hash = await this.hashPassword(password);

    // Update password and clear reset token
    await db.query(
      `UPDATE users 
       SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL 
       WHERE id = $2`,
      [password_hash, user.id]
    );

    // Logout from all devices for security
    await this.logoutAll(user.id);
  },

  /**
   * Change password (when user is logged in)
   */
  async changePassword(
    userId: number,
    data: ChangePasswordRequest
  ): Promise<void> {
    const { currentPassword, newPassword } = data;

    // Get user
    const userResult = await db.query<User>(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = userResult.rows[0];

    if (!user.password_hash) {
      throw new Error("No password set for this account");
    }

    // Verify current password
    const isValidPassword = await this.verifyPassword(
      currentPassword,
      user.password_hash
    );
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const password_hash = await this.hashPassword(newPassword);

    // Update password
    await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      password_hash,
      userId,
    ]);

    // Logout from all other devices for security
    await this.logoutAll(userId);
  },

  /**
   * Verify email (placeholder for email verification)
   */
  async verifyEmail(userId: number): Promise<void> {
    await db.query("UPDATE users SET email_verified = TRUE WHERE id = $1", [
      userId,
    ]);
  },
};
