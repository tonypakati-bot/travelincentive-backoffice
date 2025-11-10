import mongoose from 'mongoose';

async function testConnection() {
  try {
    console.log('🔌 Tentativo di connessione a MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/travel-incentive');
    console.log('✅ Connessione riuscita!');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📊 Collezioni presenti:', collections.map(c => c.name));

    // Verifica se esiste la collezione documents
    const documentsCollection = collections.find(c => c.name === 'documents');
    if (documentsCollection) {
      const count = await db.collection('documents').countDocuments();
      console.log(`📄 Documenti nella collezione 'documents': ${count}`);
    } else {
      console.log('ℹ️  La collezione "documents" non esiste ancora');
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnessione completata');
    process.exit(0);

  } catch (error) {
    console.error('❌ Errore di connessione:', error.message);
    process.exit(1);
  }
}

testConnection();