import mongoose from 'mongoose';
import { connectDB } from '../server/config/database.mjs';
import User from '../server/models/User.mjs';
import bcrypt from 'bcrypt';

const basicUser = {
  email: 'basic@example.com',
  password: 'Test123!',
  role: 'user',
  firstName: 'Mario',
  lastName: 'Rossi'
};

async function createBasicUser() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Prima elimina l'utente se esiste
    await User.deleteOne({ email: basicUser.email });
    console.log('Removed existing user if any');

    // Hasha la password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(basicUser.password, saltRounds);

    // Crea il nuovo utente con solo i campi essenziali
    const user = new User({
      email: basicUser.email,
      passwordHash,
      role: basicUser.role,
      firstName: basicUser.firstName,
      lastName: basicUser.lastName
    });

    await user.save();
    console.log('Basic user created successfully');
    console.log('\nCredenziali di accesso:');
    console.log('Email:', basicUser.email);
    console.log('Password:', basicUser.password);

  } catch (error) {
    console.error('Error creating basic user:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\nDatabase connection closed');
    }
    process.exit(0);
  }
}

createBasicUser();