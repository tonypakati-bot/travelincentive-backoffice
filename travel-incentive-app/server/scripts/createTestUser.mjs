import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.mjs';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-incentive');
    
    // Crea un utente di test con solo i campi obbligatori
    const testUser = {
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Test',
      lastName: 'User',
      role: 'user'
      // createdAt e updatedAt verranno gestiti automaticamente da Mongoose
    };

    // Verifica se l'utente esiste già
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Utente test già esistente');
      return;
    }

    // Crea il nuovo utente
    await User.create(testUser);
    console.log('Utente test creato con successo');
    console.log('Email: test@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Errore durante la creazione dell\'utente test:', error);
  } finally {
    await mongoose.connection.close();
  }
};

createTestUser();