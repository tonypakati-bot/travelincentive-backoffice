import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017/travel-incentive-test';

async function inspectCollection() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Get collection info
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Get all users
    const users = await db.collection('users').find({}).toArray();
    console.log('\nAll users:', users.map(u => ({
      id: u._id,
      email: u.email,
      hasPassword: !!u.password,
      passwordLength: u.password?.length
    })));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Connection closed');
    }
  }
}

inspectCollection();