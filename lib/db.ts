import { PrismaClient } from '@prisma/client';

// Safe environment detection: Prisma engine can only run in Node/server environments
const isServer = typeof window === 'undefined';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient | null = isServer
  ? (globalForPrisma.prisma ??
     new PrismaClient({
       log:
         process.env.NODE_ENV === 'development'
           ? ['error', 'warn']
           : ['error'],
     }))
  : null;

if (isServer && process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
