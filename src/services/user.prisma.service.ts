import { prisma } from '../config/prisma';
import type { CreateUserDto, UpdateUserDto } from '../models/user.model';
import type { User as PrismaUser } from '@prisma/client';

interface UserResponse {
  _id: string;
  name: string;
  email: string;
  age?: number | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

function toApiUser(u: PrismaUser): UserResponse {
  return {
    _id: u.id,
    name: u.name,
    email: u.email,
    age: u.age ?? undefined,
    phone: u.phone ?? undefined,
    address: u.address ?? undefined,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString()
  };
}

function isValidUUID(id: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(id);
}

export class UserPrismaService {
  async createUser(userData: CreateUserDto): Promise<UserResponse> {
    try {
      const created = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          age: userData.age,
          phone: userData.phone,
          address: userData.address
        }
      });
      return toApiUser(created);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  async getAllUsers(limit?: number, skip?: number): Promise<UserResponse[]> {
    const users = await prisma.user.findMany({
      skip: skip ?? 0,
      take: limit ?? 100,
      orderBy: { createdAt: 'desc' }
    });
    return users.map(toApiUser);
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    if (!isValidUUID(id)) {
      throw new Error('Invalid user ID format');
    }
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? toApiUser(user) : null;
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? toApiUser(user) : null;
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<UserResponse | null> {
    if (!isValidUUID(id)) {
      throw new Error('Invalid user ID format');
    }
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          name: updateData.name,
          email: updateData.email,
          age: updateData.age,
          phone: updateData.phone,
          address: updateData.address
        }
      });
      return toApiUser(updated);
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new Error('User with this email already exists');
      }
      if (error?.code === 'P2025') {
        return null; // not found
      }
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!isValidUUID(id)) {
      throw new Error('Invalid user ID format');
    }
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch (error: any) {
      if (error?.code === 'P2025') return false; // not found
      throw error;
    }
  }

  async getTotalCount(): Promise<number> {
    return prisma.user.count();
  }
}
