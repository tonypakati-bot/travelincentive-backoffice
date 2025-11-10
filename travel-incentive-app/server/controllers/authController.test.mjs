import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';
import mongoose from 'mongoose';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('\n=== Login Attempt ===');
  console.log('Request details:', {
    email,
    passwordProvided: !!password,
    env: process.env.NODE_ENV
  });

  try {
    // Verifica stato database
    const dbInfo = await mongoose.connection.db.stats();
    console.log('Database status:', {
      name: mongoose.connection.db.databaseName,
      collections: dbInfo.collections,
      documents: dbInfo.objects
    });

    // Cerca l'utente
    console.log('\nSearching for user...');
    const user = await User.findOne({ email }).select('+passwordHash');
    
    console.log('Search result:', {
      found: !!user,
      email: user?.email,
      hasPasswordHash: user ? !!user.passwordHash : false,
      fields: user ? Object.keys(user.toObject()) : []
    });

    if (!user) {
      // Se non troviamo l'utente, mostriamo tutti gli utenti per debug
      const allUsers = await User.find({});
      console.log('\nAll users in database:', allUsers.map(u => ({
        email: u.email,
        hasHash: !!u.passwordHash
      })));

      return res.status(400).json({ 
        msg: 'Invalid Credentials',
        debug: {
          error: 'User not found',
          providedEmail: email
        }
      });
    }

    // Verifica password
    console.log('\nAttempting password verification...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', {
      isMatch,
      bcryptVersion: user.password ? await bcrypt.getRounds(user.password) : 'N/A'
    });

    if (!isMatch) {
      return res.status(400).json({ 
        msg: 'Invalid Credentials',
        debug: {
          error: 'Password mismatch',
          userFound: true
        }
      });
    }

    // Genera token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        console.log('Login successful, token generated');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
};

export const registerUser = async (req, res) => {
  // ... rest of the registration code ...
};

export const getUserProfile = async (req, res) => {
  // ... rest of the profile code ...
};