import mongoose from 'mongoose';
import { connectDB, MONGODB_URI } from '../server/config/database.js';

// Configurazione mongoose per i test
mongoose.set('strictQuery', false);

// Connessione al database prima di tutti i test
beforeAll(async () => {
  try {
    // Disconnetti se già connesso
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const db = await connectDB();
    console.log('MongoDB connected successfully to:', MONGODB_URI);

    // Ottieni la lista delle collezioni
    const collections = await db.collections();
    
    // Elimina ogni collezione
    for (const collection of collections) {
      try {
        await collection.drop();
      } catch (error) {
        // Ignora errori se la collezione non esiste
        if (error.code !== 26) {
          throw error;
        }
      }
    }
    
    console.log('Database cleaned successfully');
  } catch (error) {
    console.error('MongoDB setup error:', error);
    throw error;
  }
});

// Pulizia prima di ogni test
beforeEach(async () => {
  // Elimina tutti i documenti da tutte le collezioni
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Disconnessione dopo tutti i test
afterAll(async () => {
  await mongoose.disconnect();
});

// Utility di test globali
export const createTestUser = async (User, userData = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    passwordHash: 'hashedPassword123',
    groupName: 'TestGroup',
    role: 'user',
    birthDate: new Date('1990-01-01'),
    nationality: 'IT',
    passport: {
      number: 'AB123456',
      issueDate: new Date('2020-01-01'),
      expiryDate: new Date('2030-01-01')
    }
  };

  return await User.create({ ...defaultUser, ...userData });
};

global.createTestEvent = async (Event, eventData = {}) => {
  const defaultEvent = {
    title: 'Test Event',
    registrationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    emergencyContacts: [{
      name: 'Emergency Contact',
      phone: '+1234567890',
      type: 'medical'
    }],
    agenda: [{
      date: new Date(),
      activities: [{
        time: '09:00',
        title: 'Test Activity',
        description: 'Test Description'
      }]
    }]
  };

  return await Event.create({ ...defaultEvent, ...eventData });
};