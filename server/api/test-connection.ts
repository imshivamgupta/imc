export default defineEventHandler(async (_event) => {
  try {
    // Simple test without using the database service
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log(
      "DATABASE_URL preview:",
      process.env.DATABASE_URL?.substring(0, 20) + "..."
    );

    if (!process.env.DATABASE_URL) {
      return {
        success: false,
        error: "DATABASE_URL environment variable is not set",
      };
    }

    // Test basic connection without pool
    const { Client } = await import("pg");
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      connectionTimeoutMillis: 15000, // 15 seconds timeout
    });

    await client.connect();
    const result = await client.query("SELECT NOW() as current_time");
    await client.end();

    return {
      success: true,
      message: "Database connection successful",
      currentTime: result.rows[0].current_time,
    };
  } catch (error) {
    console.error("Connection test error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    };
  }
});
