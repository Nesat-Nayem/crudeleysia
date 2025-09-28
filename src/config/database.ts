import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db: Db | null = null;
let client: MongoClient | null = null;

export async function connectDB(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // For Bun compatibility with MongoDB Atlas
    client = new MongoClient(uri, {
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false
    });
    await client.connect();
    
    console.log('✅ Connected to MongoDB Atlas');
    
    // Get the database from the URI or use default
    const dbName = uri.split('/').pop()?.split('?')[0] || 'elesyaproject';
    db = client.db(dbName);
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('MongoDB connection closed');
  }
}

export function getDB(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}
