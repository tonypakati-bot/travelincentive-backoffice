const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

const verifyUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-app');
    
    const user = await User.findOne({ email: 'test@example.com' });
    if (user) {
      console.log('Utente trovato:', {
        email: user.email,
        name: user.name,
        group: user.group,
        role: user.role,
        id: user._id,
        passwordHash: user.password.substring(0, 10) + '...'
      });
    } else {
      console.log('Utente non trovato');
    }
  } catch (error) {
    console.error('Errore durante la verifica:', error);
  } finally {
    await mongoose.connection.close();
  }
};

verifyUser();