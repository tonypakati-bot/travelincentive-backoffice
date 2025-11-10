import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/travel-incentive-test'
  : process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-incentive';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      directConnection: true
    });
    console.log('MongoDB connected successfully');

    // Test database access
    const admin = mongoose.connection.db.admin();
    await admin.ping();
    console.log('Database access verified');

    return mongoose.connection.db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export { connectDB, MONGODB_URI };