const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const resetTestUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/travel-app');
    console.log('Connected to MongoDB');
    
    console.log('Deleting existing test user...');
    await User.deleteOne({ email: 'test@example.com' });
    
    const password = 'test123'; // Password semplice per test
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Creating new test user...');
    const testUser = {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Utente Test',
      group: 'Gruppo Test',
      role: 'user'
    };

    const newUser = await User.create(testUser);
    console.log('Test user created successfully:', {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name
    });
    console.log('\nUse these credentials to login:');
    console.log('Email: test@example.com');
    console.log('Password: test123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

resetTestUser();