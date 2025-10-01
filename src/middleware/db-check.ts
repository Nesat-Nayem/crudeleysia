import { prisma } from '../config/prisma';

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    throw new Error('Database is not connected. Please ensure DATABASE_URL is set and the PostgreSQL server is reachable.');
  }
}
