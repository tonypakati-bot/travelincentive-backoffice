import mongoose from 'mongoose';
import { connectDB } from '../server/config/database.mjs';
import User from '../server/models/User.mjs';

async function listUsers() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'email firstName lastName groupName role');
    
    console.log('\nUtenti presenti nel database:');
    users.forEach(user => {
      console.log('\n-------------------');
      console.log('Nome:', user.firstName, user.lastName);
      console.log('Email:', user.email);
      console.log('Gruppo:', user.groupName);
      console.log('Ruolo:', user.role);
    });

  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\nDatabase connection closed');
    }
    process.exit(0);
  }
}

listUsers();