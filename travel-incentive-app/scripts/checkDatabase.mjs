import mongoose from 'mongoose';
import { connectDB, MONGODB_URI } from '../server/config/database.mjs';

async function checkDatabase() {
  try {
    process.env.NODE_ENV = 'test';
    console.log('Environment:', process.env.NODE_ENV);
    console.log('MongoDB URI:', MONGODB_URI);
    
    const conn = await connectDB();
    console.log('Connected to MongoDB');
    
    // Get current database name from the connection URL
    const dbName = MONGODB_URI.split('/').pop();
    console.log('Current database:', dbName);
    
    // List all collections
    const collections = await conn.listCollections().toArray();
    console.log('\nCollections:', collections.map(c => c.name));
    
    // Count users
    const usersCount = await conn.collection('users').countDocuments();
    console.log('\nNumber of users:', usersCount);
    
    // Get all users with limited fields
    const users = await conn.collection('users').find({}, {
      projection: {
        email: 1,
        firstName: 1,
        lastName: 1,
        role: 1,
        groupName: 1,
        passwordHash: 1
      }
    }).toArray();
    console.log('\nUsers in database:');
    console.log(JSON.stringify(users, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

checkDatabase();