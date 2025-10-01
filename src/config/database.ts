import dotenv from 'dotenv';
import { prisma } from './prisma';
import { connectDB as prismaConnect, closeDB as prismaClose } from './prisma';

// Only load .env in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Re-export Prisma client and helpers for backward compatibility
export const connectDB = prismaConnect;
export const closeDB = prismaClose;
export { prisma };
