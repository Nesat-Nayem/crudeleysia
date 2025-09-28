import { ObjectId } from 'mongodb';
import { getDB } from '../config/database';
import type { User, CreateUserDto, UpdateUserDto } from '../models/user.model';

const COLLECTION_NAME = 'users';

export class UserService {
  private get collection() {
    return getDB().collection<User>(COLLECTION_NAME);
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      // Check if email already exists
      const existingUser = await this.collection.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user: User = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await this.collection.insertOne(user);
      return {
        ...user,
        _id: result.insertedId
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(limit?: number, skip?: number): Promise<User[]> {
    try {
      const users = await this.collection
        .find({})
        .skip(skip || 0)
        .limit(limit || 100)
        .toArray();
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }
      
      const user = await this.collection.findOne({ _id: new ObjectId(id) });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.collection.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<User | null> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      // Check if email is being updated and if it already exists
      if (updateData.email) {
        const existingUser = await this.collection.findOne({ 
          email: updateData.email,
          _id: { $ne: new ObjectId(id) }
        });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
      }

      const result = await this.collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        },
        { returnDocument: 'after' }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      return await this.collection.countDocuments();
    } catch (error) {
      throw error;
    }
  }
}
