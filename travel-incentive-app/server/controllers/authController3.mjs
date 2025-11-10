import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';

export const loginUser = async (req, res) => {
  console.log('\n=== Login Attempt ===');
  console.log('Request details:', {
    body: req.body,
    email: req.body.email,
    passwordProvided: !!req.body.password
  });

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('❌ Validation failed: Missing email or password');
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    // Convert email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase();
    console.log('Looking for user with normalized email:', normalizedEmail);

    // Try to find user with both password fields
    let user = await User.findOne({ email: normalizedEmail });
    console.log('Initial user lookup result:', {
      found: !!user,
      fields: user ? Object.keys(user.toObject()) : []
    });

    if (!user) {
      console.log('User not found with email:', normalizedEmail);
      return res.status(400).json({ 
        msg: 'Invalid Credentials',
        debug: {
          error: 'User not found',
          providedEmail: email
        }
      });
    }

    // Check which password field exists
    const hashedPassword = user.passwordHash || user.password;
    console.log('Password field check:', {
      hasPasswordHash: !!user.passwordHash,
      hasPassword: !!user.password,
      usingField: user.passwordHash ? 'passwordHash' : 'password'
    });

    if (!hashedPassword) {
      console.log('No password hash found in user document');
      return res.status(400).json({
        msg: 'Invalid Credentials',
        debug: {
          error: 'No password hash found',
          userFound: true
        }
      });
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification result:', { isMatch });

    if (!isMatch) {
      return res.status(400).json({ 
        msg: 'Invalid Credentials',
        debug: {
          error: 'Password mismatch',
          userFound: true
        }
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          console.error('JWT signing error:', err);
          throw err;
        }
        console.log('Login successful, token generated');
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
};