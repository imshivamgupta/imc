import { db } from "../utils/database";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  QueryOptions,
} from "../types";

export const UserService = {
  /**
   * Initialize user table
   */
  async initializeTable(): Promise<void> {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INTEGER,
        image_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserRequest): Promise<User> {
    const result = await db.query<User>(
      "INSERT INTO users (name, email, age, phone, image_path) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        userData.name,
        userData.email,
        userData.age || null,
        userData.phone || null,
        userData.image_path || null,
      ]
    );

    if (result.rows.length === 0) {
      throw new Error("Failed to create user");
    }

    return result.rows[0];
  },

  /**
   * Get all users with optional pagination and sorting
   */
  async getAllUsers(
    options: QueryOptions = {}
  ): Promise<{ users: User[]; total: number }> {
    const {
      limit,
      offset,
      orderBy = "created_at",
      orderDirection = "DESC",
    } = options;

    let query = `SELECT * FROM users ORDER BY ${orderBy} ${orderDirection}`;
    const params: unknown[] = [];

    if (limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(limit);
    }

    if (offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(offset);
    }

    const [usersResult, countResult] = await Promise.all([
      db.query<User>(query, params),
      db.query<{ count: string }>("SELECT COUNT(*) as count FROM users"),
    ]);

    return {
      users: usersResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  },

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    const result = await db.query<User>("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  /**
   * Update user by ID
   */
  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (userData.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(userData.name);
    }

    if (userData.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(userData.email);
    }

    if (userData.age !== undefined) {
      fields.push(`age = $${paramIndex++}`);
      values.push(userData.age);
    }

    if (userData.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`);
      values.push(userData.phone);
    }

    if (userData.image_path !== undefined) {
      fields.push(`image_path = $${paramIndex++}`);
      values.push(userData.image_path);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(
      ", "
    )} WHERE id = $${paramIndex} RETURNING *`;

    const result = await db.query<User>(query, values);
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  /**
   * Delete user by ID
   */
  async deleteUser(id: number): Promise<User | null> {
    const result = await db.query<User>(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  /**
   * Check if email exists
   */
  async emailExists(email: string, excludeId?: number): Promise<boolean> {
    let query = "SELECT id FROM users WHERE email = $1";
    const params: unknown[] = [email];

    if (excludeId) {
      query += " AND id != $2";
      params.push(excludeId);
    }

    const result = await db.query(query, params);
    return result.rows.length > 0;
  },

  /**
   * Get users by age range
   */
  async getUsersByAgeRange(minAge: number, maxAge: number): Promise<User[]> {
    const result = await db.query<User>(
      "SELECT * FROM users WHERE age BETWEEN $1 AND $2 ORDER BY age",
      [minAge, maxAge]
    );
    return result.rows;
  },

  /**
   * Search users by name or email
   */
  async searchUsers(searchTerm: string): Promise<User[]> {
    const result = await db.query<User>(
      "SELECT * FROM users WHERE name ILIKE $1 OR email ILIKE $1 ORDER BY name",
      [`%${searchTerm}%`]
    );
    return result.rows;
  },
};
