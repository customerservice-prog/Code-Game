// Prisma client singleton.
// Next.js hot-reloads modules in development, which would otherwise create
// a new PrismaClient (and a new DB connection pool) on every reload. We
// cache the client on the global object to avoid exhausting connections.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
