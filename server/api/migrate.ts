import { db } from "../utils/database";
import { ErrorHandler } from "../utils/errorHandler";

const migrations = [
  {
    name: "create_users_table",
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  },
  {
    name: "add_age_column_to_users",
    sql: `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS age INTEGER;
    `,
  },
  {
    name: "add_phone_column_to_users",
    sql: `
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
    `,
  },
];

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event, "GET");

    if (method !== "POST") {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }

    // Create migrations table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get already executed migrations
    const executedMigrations = await db.query("SELECT name FROM migrations");
    const executedNames = executedMigrations.rows.map((row) => row.name);

    const pendingMigrations = migrations.filter(
      (migration) => !executedNames.includes(migration.name)
    );

    if (pendingMigrations.length === 0) {
      return ErrorHandler.createSuccessResponse(
        { executed: [], pending: 0 },
        "No pending migrations"
      );
    }

    const executed: string[] = [];

    // Execute pending migrations in a transaction
    await db.transaction(async (client) => {
      for (const migration of pendingMigrations) {
        await client.query(migration.sql);
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [
          migration.name,
        ]);
        executed.push(migration.name);
      }
    });

    return ErrorHandler.createSuccessResponse(
      { executed, total: executed.length },
      `Successfully executed ${executed.length} migrations`
    );
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
