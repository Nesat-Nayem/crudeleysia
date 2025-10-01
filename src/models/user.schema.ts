// Prisma migration: Mongoose schema removed.
// Keeping types for any residual imports.

export interface IUser {
  name: string;
  email: string;
  age?: number;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// No model export here; use Prisma Client instead (see `src/config/prisma.ts`).
