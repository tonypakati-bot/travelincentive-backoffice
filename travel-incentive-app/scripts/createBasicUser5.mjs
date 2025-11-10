import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017/travel-incentive-test';

async function createBasicUser() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    // Delete existing user if present
    await users.deleteOne({ email: 'basic@example.com' });
    
    // Create password hash
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('Test123!', salt);
    
    // Create new user with password field
    const user = {
      email: 'basic@example.com',
      firstName: 'Basic',
      lastName: 'User',
      password: password,  // Using password instead of passwordHash
      groupName: 'Default',
      role: 'user',
      birthDate: new Date('1990-01-01'),
      nationality: 'IT',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await users.insertOne(user);
    console.log('User created:', {
      id: result.insertedId,
      email: user.email,
      hasPassword: !!user.password,
      passwordLength: user.password.length
    });
    
    // Verify the user was created correctly
    const savedUser = await users.findOne({ email: 'basic@example.com' });
    console.log('Saved user:', {
      id: savedUser._id,
      email: savedUser.email,
      hasPassword: !!savedUser.password,
      passwordLength: savedUser.password.length
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Connection closed');
    }
    process.exit(0);
  }
}

createBasicUser();