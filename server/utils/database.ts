import { Pool, type PoolClient, type QueryResult } from "pg";

class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for Neon
      },
      max: 10, // Maximum number of clients in the pool (reduced for Neon)
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
      connectionTimeoutMillis: 10000, // Increased timeout for Neon (10 seconds)
    });

    // Handle pool errors
    this.pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Execute a query with automatic connection management
   */
  public async query<
    T extends Record<string, unknown> = Record<string, unknown>
  >(text: string, params?: unknown[]): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  public async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get a client from the pool for manual management
   */
  public async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  /**
   * Close all connections in the pool
   */
  public async close(): Promise<void> {
    await this.pool.end();
  }

  /**
   * Get pool status
   */
  public getPoolStatus() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance();
export default DatabaseService;
