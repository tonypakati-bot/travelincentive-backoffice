import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../server/models/User.mjs';

const MONGODB_URI = 'mongodb://localhost:27017/travel-incentive-test';

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');
    
    // Wait a bit to ensure the connection is fully established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

async function recreateBasicUser() {
  try {
    await connectToMongoDB();
    
    console.log('Deleting existing basic user...');
    const deleteResult = await User.deleteOne({ email: 'basic@example.com' });
    console.log('Delete result:', deleteResult);

    console.log('Creating new basic user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Test123!', salt);

    const user = new User({
      email: 'basic@example.com',
      firstName: 'Basic',
      lastName: 'User',
      passwordHash: hashedPassword,
      groupName: 'Default',
      role: 'user',
      birthDate: new Date('1990-01-01'),
      nationality: 'IT'
    });

    console.log('Saving user...');
    const savedUser = await user.save();
    console.log('Basic user created successfully');
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
    console.error('Error recreating basic user:', error);
  } finally {
    console.log('Closing connection...');
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  }
}

recreateBasicUser();