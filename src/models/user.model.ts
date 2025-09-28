import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  age?: number;
  phone?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  age?: number;
  phone?: string;
  address?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  age?: number;
  phone?: string;
  address?: string;
}
