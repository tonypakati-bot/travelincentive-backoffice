const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const debugDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-app');
    console.log('Connected to MongoDB');

    // List all users
    console.log('\nListing all users:');
    const users = await User.find({});
    users.forEach(user => {
      console.log({
        id: user._id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        passwordLength: user.password?.length
      });
    });

    // Clean up test users
    console.log('\nCleaning up test users...');
    await User.deleteMany({ email: 'test@example.com' });
    console.log('Test users deleted');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

debugDB();