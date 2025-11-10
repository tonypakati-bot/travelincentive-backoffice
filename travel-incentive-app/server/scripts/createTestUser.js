import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.mjs';

dotenv.config();

const createTestUser = async () => {
  try {
    // Crea un utente di test
    const testUser = {
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Utente',
      lastName: 'Test',
      groupName: 'Gruppo Test',
      role: 'user',
      birthDate: new Date('1990-01-01'),
      nationality: 'IT',
      mobilePhone: '+39123456789'
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