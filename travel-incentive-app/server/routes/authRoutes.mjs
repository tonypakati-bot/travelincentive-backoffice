import express from 'express';
import { loginUser, getUserProfile } from '../controllers/authController.mjs';
import auth from '../middleware/auth.mjs';

const router = express.Router();

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getUserProfile);

export default router;
