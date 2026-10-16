import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/db/schema";
import { resolveDatabaseUrl } from "./database-url";

declare global {
  var __modzPool: Pool | undefined;
  var __modzPoolConnectionString: string | undefined;
}

const configuredUrl =
  process.env.DATABASE_URL ?? "postgresql://modz:modz@localhost:5432/modz";
const connectionString = resolveDatabaseUrl(configuredUrl);

const cachedPool =
  globalThis.__modzPoolConnectionString === connectionString
    ? globalThis.__modzPool
    : undefined;
const pool =
  cachedPool ??
  new Pool({
    connectionString,
    max: process.env.NODE_ENV === "production" ? 10 : 3,
    connectionTimeoutMillis: 3_000,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") {
  if (globalThis.__modzPool && globalThis.__modzPool !== pool) {
    void globalThis.__modzPool.end().catch(() => {});
  }
  globalThis.__modzPool = pool;
  globalThis.__modzPoolConnectionString = connectionString;
}

export const db = drizzle(pool, { schema });
