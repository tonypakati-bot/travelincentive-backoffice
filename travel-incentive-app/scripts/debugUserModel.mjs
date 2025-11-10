import mongoose from 'mongoose';
import { connectDB } from '../server/config/database.mjs';
import User from '../server/models/User.mjs';

async function debugUserModel() {
  try {
    process.env.NODE_ENV = 'test';
    const conn = await connectDB();
    console.log('\n=== Database Connection ===');
    console.log('Connected to:', mongoose.connection.name);

    console.log('\n=== Raw MongoDB Query ===');
    const rawUsers = await conn.collection('users').find({}).toArray();
    console.log('Users from raw query:', rawUsers.map(u => ({
      id: u._id,
      email: u.email,
      hasPassword: !!u.passwordHash
    })));

    console.log('\n=== Mongoose Model Query ===');
    const modelUsers = await User.find({});
    console.log('Users from model:', modelUsers.map(u => ({
      id: u._id,
      email: u.email,
      hasPassword: !!u.passwordHash
    })));

    console.log('\n=== Specific User Query ===');
    const specificUser = await User.findOne({ email: 'basic@example.com' });
    console.log('Specific user details:', specificUser ? {
      found: true,
      id: specificUser._id,
      email: specificUser.email,
      hasPassword: !!specificUser.passwordHash,
      modelFields: Object.keys(specificUser.toObject())
    } : 'Not found');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

debugUserModel();