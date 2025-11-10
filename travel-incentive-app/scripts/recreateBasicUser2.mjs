import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://localhost:27017/travel-incentive-test';

async function recreateBasicUser() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    const users = db.collection('users');
    
    // Delete existing user
    console.log('Deleting existing basic user...');
    const deleteResult = await users.deleteOne({ email: 'basic@example.com' });
    console.log('Delete result:', deleteResult);
    
    // Create new user
    console.log('Creating new basic user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Test123!', salt);
    
    const user = {
      email: 'basic@example.com',
      firstName: 'Basic',
      lastName: 'User',
      passwordHash: hashedPassword,
      groupName: 'Default',
      role: 'user',
      birthDate: new Date('1990-01-01'),
      nationality: 'IT',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const insertResult = await users.insertOne(user);
    console.log('Insert result:', insertResult);
    
    // Verify the user was created
    const savedUser = await users.findOne({ email: 'basic@example.com' });
    console.log('Saved user details:', {
      id: savedUser._id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      hasPasswordHash: !!savedUser.passwordHash,
      passwordHashLength: savedUser.passwordHash?.length,
      groupName: savedUser.groupName,
      role: savedUser.role
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      console.log('Closing connection...');
      await client.close();
      console.log('Connection closed');
    }
    process.exit(0);
  }
}

recreateBasicUser();