const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const recreateTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-app');
    
    // Prima eliminiamo l'utente test se esiste
    await User.deleteOne({ email: 'test@example.com' });
    
    // Creiamo un nuovo utente test con password nota
    const testUser = {
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Utente Test',
      group: 'Gruppo Test',
      role: 'user'
    };

    await User.create(testUser);
    console.log('Utente test ricreato con successo');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    // Verifichiamo che l'utente sia stato creato correttamente
    const user = await User.findOne({ email: 'test@example.com' });
    console.log('Verifica utente:', {
      email: user.email,
      name: user.name,
      group: user.group,
      role: user.role,
      id: user._id
    });

  } catch (error) {
    console.error('Errore durante la ricreazione dell\'utente test:', error);
  } finally {
    await mongoose.connection.close();
  }
};

recreateTestUser();