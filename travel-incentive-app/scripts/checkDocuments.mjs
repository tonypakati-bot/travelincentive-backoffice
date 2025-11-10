import mongoose from 'mongoose';
import Document from '../server/models/Document.mjs';

async function checkDocuments() {
  try {
    await mongoose.connect('mongodb://localhost:27017/travel-incentive');
    const total = await Document.countDocuments();
    const withoutUserId = await Document.countDocuments({ userId: { $exists: false } });
    console.log('Documenti totali:', total);
    console.log('Documenti senza userId:', withoutUserId);

    if (withoutUserId > 0) {
      console.log('\nDocumenti senza userId trovati. Eseguire migrazione...');
      // Qui potremmo aggiungere la logica di migrazione
    }

    process.exit(0);
  } catch (error) {
    console.error('Errore:', error);
    process.exit(1);
  }
}

checkDocuments();