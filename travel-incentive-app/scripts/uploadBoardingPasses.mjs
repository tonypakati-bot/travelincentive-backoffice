import mongoose from 'mongoose';
import Document from '../models/Document.mjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connessione al database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/travel-incentive');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Carica carte d'imbarco per volo
const uploadBoardingPass = async (userId, flightId, filePath, description = '') => {
  try {
    // Verifica che il file esista
    if (!fs.existsSync(filePath)) {
      throw new Error(`File non trovato: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    const filename = path.basename(filePath);

    // Crea la directory uploads se non esiste
    const uploadDir = path.join(__dirname, '../uploads/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Copia il file nella directory uploads
    const destPath = path.join(uploadDir, filename);
    fs.copyFileSync(filePath, destPath);

    // Salva nel database
    const document = new Document({
      userId,
      flightId,
      filename,
      originalName: filename,
      mimeType: 'application/pdf',
      size: stats.size,
      url: `/uploads/documents/${filename}`,
      description,
      documentType: 'boarding_pass'
    });

    await document.save();
    console.log(`✅ Carta d'imbarco caricata per utente ${userId}, volo ${flightId}: ${filename}`);
    return document;
  } catch (error) {
    console.error(`❌ Errore caricamento carta d'imbarco per utente ${userId}, volo ${flightId}:`, error.message);
    throw error;
  }
};

// Script principale
const main = async () => {
  await connectDB();

  console.log('🚀 Caricamento carte d\'imbarco...\n');

  // Esempio: carica carte d'imbarco per voli specifici
  // Sostituisci con i tuoi userId, flightId e percorsi file reali
  const boardingPasses = [
    // { userId: 'USER_ID_1', flightId: 'FLIGHT_ID_1', filePath: '/percorso/al/file1.pdf', description: 'Volo di andata' },
    // { userId: 'USER_ID_2', flightId: 'FLIGHT_ID_2', filePath: '/percorso/al/file2.pdf', description: 'Volo di ritorno' },
  ];

  if (boardingPasses.length === 0) {
    console.log('ℹ️  Nessuna carta d\'imbarco da caricare. Modifica lo script con i tuoi dati.');
    console.log('📝 Esempio:');
    console.log('   { userId: "user123", flightId: "ABC123", filePath: "/Users/utente/Desktop/boarding_pass.pdf", description: "Volo di andata Milano-Roma" }');
    process.exit(0);
  }

  for (const bp of boardingPasses) {
    try {
      await uploadBoardingPass(bp.userId, bp.flightId, bp.filePath, bp.description);
    } catch (error) {
      console.error(`Errore per utente ${bp.userId}, volo ${bp.flightId}:`, error);
    }
  }

  console.log('\n✨ Caricamento completato!');
  process.exit(0);
};

main().catch((error) => {
  console.error('Errore script:', error);
  process.exit(1);
});