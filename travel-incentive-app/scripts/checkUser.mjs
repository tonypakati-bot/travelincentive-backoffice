import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017/travel-incentive-test';

async function checkUserInDatabase() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    // Get raw document from MongoDB
    const rawUser = await users.findOne({ email: 'basic@example.com' });
    console.log('Raw user from MongoDB:', JSON.stringify(rawUser, null, 2));
    
    if (rawUser) {
      console.log('User details:', {
        id: rawUser._id,
        email: rawUser.email,
        hasPassword: !!rawUser.password,
        hasPasswordHash: !!rawUser.passwordHash,
        passwordField: rawUser.password || rawUser.passwordHash
      });
    } else {
      console.log('User not found');
      
      // List all users in the database
      const allUsers = await users.find({}).toArray();
      console.log('All users in database:', 
        allUsers.map(u => ({
          email: u.email,
          hasPassword: !!u.password,
          hasPasswordHash: !!u.passwordHash
        }))
      );
    }
    
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

checkUserInDatabase();