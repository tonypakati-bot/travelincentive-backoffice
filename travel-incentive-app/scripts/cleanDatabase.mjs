import mongoose from 'mongoose';
import { connectDB } from '../server/config/database.mjs';
import Event from '../server/models/Event.mjs';
import Flight from '../server/models/Flight.mjs';
import Photo from '../server/models/Photo.mjs';
import EmergencyContact from '../server/models/EmergencyContact.mjs';

async function cleanDatabase() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Elimina tutti i dati da ogni collezione
    await Event.deleteMany({});
    console.log('Eventi eliminati');

    await Flight.deleteMany({});
    console.log('Voli eliminati');

    await Photo.deleteMany({});
    console.log('Foto eliminate');

    await EmergencyContact.deleteMany({});
    console.log('Contatti di emergenza eliminati');

    console.log('Database pulito con successo');
  } catch (error) {
    console.error('Errore durante la pulizia del database:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Connessione al database chiusa');
    }
    process.exit(0);
  }
}

cleanDatabase();