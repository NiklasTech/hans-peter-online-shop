/**
 * Database Connection Module
 *
 * This module handles the database connection setup and exports
 * a database client/connection pool for use throughout the application.
 */

import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: typeof PrismaClient.prototype | undefined;
};

// @ts-expect-error - Prisma Client constructor signature issue
export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
