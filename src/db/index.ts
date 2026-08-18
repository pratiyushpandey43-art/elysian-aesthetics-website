import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL?.trim();

const globalForDb = globalThis as typeof globalThis & {
  __elysianPostgresqlPool?: Pool;
};

export const pool = databaseUrl
  ? (globalForDb.__elysianPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    }))
  : null;

if (pool && process.env.NODE_ENV !== "production") {
  globalForDb.__elysianPostgresqlPool = pool;
}

export const db = pool ? drizzle(pool) : null;
export const databaseConfigured = db !== null;
export const demoModeEnabled = db === null && process.env.NODE_ENV !== "production";
