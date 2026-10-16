import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/db/schema";

declare global {
  var __modzPool: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://modz:modz@localhost:5432/modz";

const pool =
  globalThis.__modzPool ??
  new Pool({
    connectionString,
    max: process.env.NODE_ENV === "production" ? 10 : 3,
    connectionTimeoutMillis: 3_000,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") globalThis.__modzPool = pool;

export const db = drizzle(pool, { schema });
