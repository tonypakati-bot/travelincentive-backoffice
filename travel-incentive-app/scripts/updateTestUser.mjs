import mongoose from 'mongoose';
import { connectDB } from '../server/config/database.mjs';
import User from '../server/models/User.mjs';

async function updateTestUser() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Aggiorna il primo utente test con il gruppo Milano Malpensa
    const updatedUser = await User.findOneAndUpdate(
      { email: 'test@example.com' },
      { 
        $set: { 
          groupName: 'Milano Malpensa',
          // Aggiorniamo anche altri dati per renderli più realistici
          firstName: 'Marco',
          lastName: 'Bianchi',
          mobilePhone: '+39 333 1234567',
          nationality: 'Italiana'
        }
      },
      { new: true }
    );

    if (updatedUser) {
      console.log('\nUtente aggiornato con successo:');
      console.log('Nome:', updatedUser.firstName, updatedUser.lastName);
      console.log('Email:', updatedUser.email);
      console.log('Gruppo:', updatedUser.groupName);
      console.log('Ruolo:', updatedUser.role);
      console.log('\nPuoi accedere con:');
      console.log('Email:', updatedUser.email);
      console.log('Password: hashedPassword123');
    } else {
      console.log('Utente non trovato');
    }

  } catch (error) {
    console.error('Error updating test user:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\nDatabase connection closed');
    }
    process.exit(0);
  }
}

updateTestUser();