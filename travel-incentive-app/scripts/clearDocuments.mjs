import { MongoClient } from 'mongodb';

async function clearDocuments() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connessione a MongoDB riuscita');

    const database = client.db('travel-incentive');
    const collection = database.collection('documents');

    // Conta documenti prima della cancellazione
    const countBefore = await collection.countDocuments();
    console.log(`📊 Documenti presenti nel database: ${countBefore}`);

    if (countBefore === 0) {
      console.log('ℹ️  Nessun documento da eliminare.');
      return;
    }

    // Elimina tutti i documenti
    const result = await collection.deleteMany({});
    console.log(`✅ Eliminati ${result.deletedCount} documenti dal database`);

    // Verifica che la collezione sia vuota
    const countAfter = await collection.countDocuments();
    console.log(`📊 Documenti rimanenti: ${countAfter}`);

    console.log('✨ Operazione completata con successo!');

  } catch (error) {
    console.error('❌ Errore durante la cancellazione:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 Connessione chiusa');
  }
}

clearDocuments().catch(console.error);