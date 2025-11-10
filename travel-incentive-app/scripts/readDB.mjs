import mongoose from 'mongoose';
import { connectDB } from '../server/config/database.mjs';
import User from '../server/models/User.mjs';

async function readDatabase() {
  try {
    process.env.NODE_ENV = 'test';
    await connectDB();
    console.log('Connected to MongoDB test database');

    const users = await User.find({});
    console.log('\nUsers in database:');
    console.log(JSON.stringify(users, null, 2));

    // Also check all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    console.log(collections.map(c => c.name));

  } catch (error) {
    console.error('Error reading database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

readDatabase();