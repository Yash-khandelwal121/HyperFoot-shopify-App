import { PrismaClient } from "@prisma/client";

/**
 * Prisma Singleton — safe for both Vercel serverless and local dev.
 *
 * In dev (hot-reload), we store the instance on `globalThis` to avoid
 * creating a new client on every module reload.
 *
 * In production serverless, each function instance gets exactly one
 * PrismaClient for its lifetime — no leaking, no exhausted connections.
 */

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
