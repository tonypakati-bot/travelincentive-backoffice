const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const resetDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/travel-app');
    console.log('Connected to MongoDB');
    
    // Delete all existing users
    await User.deleteMany({});
    console.log('Deleted all users');
    
    // Create a simple test user with a simple password
    const simplePassword = 'test123';
    const hashedPassword = await bcrypt.hash(simplePassword, 10);
    
    const testUser = new User({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      group: 'Test Group',
      role: 'user'
    });

    await testUser.save();
    
    console.log('\nCreated test user:');
    console.log('Email: test@example.com');
    console.log('Password: test123');
    console.log('Hashed password:', hashedPassword);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

resetDB();