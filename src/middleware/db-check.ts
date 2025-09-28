import mongoose from 'mongoose';

export function checkDatabaseConnection() {
  const isConnected = mongoose.connection.readyState === 1;
  
  if (!isConnected) {
    throw new Error('Database is not connected. Please ensure MongoDB Atlas allows access from your IP address.');
  }
}
