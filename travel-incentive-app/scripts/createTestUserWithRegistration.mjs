import mongoose from 'mongoose';
import { connectDB } from '../server/config/database.mjs';
import User from '../server/models/User.mjs';
import bcrypt from 'bcrypt';

const testUser = {
  email: 'marco.bianchi@bevnet.it',
  firstName: 'Marco',
  lastName: 'Bianchi',
  passwordHash: 'Test123!',  // Questa password verrà hashata
  role: 'user',
  birthDate: '1985-01-01',
  nationality: 'Italiana',
  mobilePhone: '+39 333 1234567',
  passport: {
    number: 'YA1234567',
    issueDate: '2020-01-01',
    expiryDate: '2030-01-01'
  },
  // Dati della registrazione
  registrationData: {
    departureAirport: 'Milano Malpensa',
    roomType: 'Doppia',
    businessClass: false
  }
};

async function createTestUserWithRegistration() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Prima elimina l'utente se esiste
    await User.deleteOne({ email: testUser.email });
    console.log('Removed existing test user if any');

    // Hasha la password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(testUser.passwordHash, saltRounds);

    // Crea il nuovo utente con il gruppo basato sull'aeroporto di partenza
    const user = new User({
      ...testUser,
      passwordHash,
      groupName: testUser.registrationData.departureAirport,  // Il gruppo corrisponde all'aeroporto di partenza
      preferences: new Map()
    });

    await user.save();
    console.log('Test user created successfully');
    console.log('\nDettagli utente:');
    console.log('Nome:', user.firstName, user.lastName);
    console.log('Email:', testUser.email);
    console.log('Password:', testUser.passwordHash);
    console.log('Gruppo:', user.groupName);
    console.log('\nDati registrazione:');
    console.log('Aeroporto:', testUser.registrationData.departureAirport);
    console.log('Camera:', testUser.registrationData.roomType);
    console.log('Business Class:', testUser.registrationData.businessClass ? 'Sì' : 'No');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\nDatabase connection closed');
    }
    process.exit(0);
  }
}

createTestUserWithRegistration();