import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Only load .env in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Ensure a single PrismaClient instance in dev/watch mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as any;

export const prisma: PrismaClient =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    // Simple ping
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Connected to PostgreSQL via Prisma');
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    throw error;
  }
}

export async function closeDB(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('PostgreSQL connection closed');
  } catch (error) {
    // ignore
  }
}
