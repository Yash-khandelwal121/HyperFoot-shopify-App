import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  // In Vercel serverless, each cold start gets a fresh module scope.
  // Always create a new client — connection pooling is handled by the DB URL.
  prisma = new PrismaClient();
} else {
  // In development, reuse a global singleton to avoid hot-reload connection leaks.
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
  prisma = global.prismaGlobal;
}

export default prisma;
