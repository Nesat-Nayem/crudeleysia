import { User } from '../models/user.schema';
import type { IUser } from '../models/user.schema';
import type { CreateUserDto, UpdateUserDto } from '../models/user.model';

export class UserMongooseService {
  async createUser(userData: CreateUserDto): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  async getAllUsers(limit?: number, skip?: number): Promise<IUser[]> {
    try {
      const query = User.find({});
      
      if (skip) query.skip(skip);
      if (limit) query.limit(limit);
      
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid user ID format');
      }
      
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<IUser | null> {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid user ID format');
      }

      // Check if email is being updated and if it already exists
      if (updateData.email) {
        const existingUser = await User.findOne({ 
          email: updateData.email,
          _id: { $ne: id }
        });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
      }

      return await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid user ID format');
      }

      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      return await User.countDocuments();
    } catch (error) {
      throw error;
    }
  }
}
