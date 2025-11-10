import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017/travel-incentive-test';

async function inspectUser() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    // Get raw document from MongoDB
    const user = await users.findOne({ email: 'basic@example.com' });
    if (user) {
      console.log('Raw user document:', JSON.stringify(user, null, 2));
      console.log('\nDocument fields:', Object.keys(user));
      console.log('\nPassword fields:', {
        hasPassword: !!user.password,
        passwordLength: user.password?.length,
        hasPasswordHash: !!user.passwordHash,
        passwordHashLength: user.passwordHash?.length
      });
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Connection closed');
    }
  }
}

inspectUser();