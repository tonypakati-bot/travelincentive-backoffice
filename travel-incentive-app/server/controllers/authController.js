const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, group, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      group,
      role
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Login User
exports.loginUser = async (req, res) => {
  console.log('Login attempt:', { 
    body: req.body,
    headers: req.headers,
    email: req.body.email
  });

  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    let user = await User.findOne({ email });
    console.log('User search result:', {
      found: !!user,
      email: email,
      userEmail: user?.email,
      hasPassword: user ? !!user.password : false,
      passwordLength: user?.password?.length
    });

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(400).json({ 
        msg: 'Invalid Credentials',
        debug: {
          error: 'User not found',
          providedEmail: email
        }
      });
    }

    console.log('Attempting password comparison...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', {
      isMatch,
      providedEmail: email,
      passwordLength: password?.length,
      storedHashLength: user.password?.length
    });
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ 
        msg: 'Invalid Credentials',
        debug: {
          error: 'Password mismatch',
          userFound: true,
          passwordMatch: false,
          providedEmail: email,
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
      process.env.JWT_SECRET,
      // Rimuoviamo expiresIn per creare un token senza scadenza
      (err, token) => {
        if (err) {
          console.error('Error signing JWT:', err);
          throw err;
        }
        console.log('Login successful, sending permanent token:', { token: token?.substring(0, 20) + '...' });
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
