/**
 * Database Connection Module
 *
 * This module handles the database connection setup and exports
 * a database client/connection pool for use throughout the application.
 */

import { PrismaClient } from "@/app/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Erstelle einen Pool für PostgreSQL-Verbindungen
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

// Erstelle den Prisma Adapter
const adapter = new PrismaPg(pool);

// Erstelle den PrismaClient mit dem Adapter
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.pool = pool;
}
