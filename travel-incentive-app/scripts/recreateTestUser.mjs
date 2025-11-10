import mongoose from 'mongoose';
import { connectDB } from '../server/config/database.mjs';
import User from '../server/models/User.mjs';
import bcrypt from 'bcrypt';

const testUser = {
  email: 'basic@example.com',
  password: 'Test123!',
  firstName: 'Mario',
  lastName: 'Rossi',
  groupName: 'Default',
  role: 'user',
  nationality: 'IT',
  birthDate: new Date('1990-01-01')
};

async function recreateTestUser() {
  try {
    process.env.NODE_ENV = 'test';
    await connectDB();
    console.log('Connected to MongoDB');

    // Prima elimina l'utente se esiste
    console.log('Removing existing user if any...');
    await User.deleteOne({ email: testUser.email });

    // Crea l'hash della password
    console.log('Creating password hash...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(testUser.password, saltRounds);

    // Crea il nuovo utente
    console.log('Creating new user...');
    const user = new User({
      ...testUser,
      passwordHash,
      preferences: new Map()
    });

    await user.save();
    console.log('Test user created successfully');

    // Verifica che l'utente sia stato creato correttamente
    const createdUser = await User.findOne({ email: testUser.email });
    console.log('\nVerification - Created user:', {
      id: createdUser._id,
      email: createdUser.email,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      hasPasswordHash: !!createdUser.passwordHash,
      passwordHashLength: createdUser.passwordHash?.length
    });

    console.log('\nCredenziali di accesso:');
    console.log('Email:', testUser.email);
    console.log('Password:', testUser.password);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

recreateTestUser();