import { db } from "../utils/database";
import { ErrorHandler } from "../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    // Get database name and connection info
    const [dbNameResult, userResult, versionResult] = await Promise.all([
      db.query("SELECT current_database() as db_name"),
      db.query("SELECT current_user as db_user"),
      db.query("SELECT version() as db_version"),
    ]);

    const poolStatus = db.getPoolStatus();

    const data = {
      database_name: dbNameResult.rows[0].db_name,
      database_user: userResult.rows[0].db_user,
      database_version: versionResult.rows[0].db_version,
      connection_string: process.env.DATABASE_URL ? "Set" : "Not Set",
      pool_status: poolStatus,
    };

    return ErrorHandler.createSuccessResponse(
      data,
      "Database info retrieved successfully"
    );
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
