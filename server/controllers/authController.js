const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library'); // Import Google OAuth2Client

// Load environment variables (ensure path is correct relative to this file)
require('dotenv').config({ path: './.env' }); // Assuming .env is directly in server/

const googleClientId = process.env.GOOGLE_CLIENT_ID; // Get Client ID from .env
const client = new OAuth2Client(googleClientId); // Initialize Google OAuth client

// Helper function to generate your custom JWT
const generateToken = (user) => {
  // Ensure the payload matches what your protect middleware expects (e.g., email)
  return jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

// @desc    Register a new user (traditional signup)
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists with this email.' });
    }

    // Create a new user with hashed password (handled by pre-save hook in User model)
    const user = await User.create({ name, email, password });

    // Generate custom JWT for the new user
    const token = generateToken(user);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ msg: 'Server error during signup', error: error.message });
  }
};

// @desc    Authenticate user (traditional login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Check if user exists and if they have a password (not a Google-only account)
    if (!user || !user.password) {
      return res.status(401).json({ msg: 'Invalid credentials or user registered via Google. Please use Google Sign-In.' });
    }

    // Compare provided password with hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Generate custom JWT
    const token = generateToken(user);
    res.status(200).json({ user: { email: user.email, name: user.name, id: user._id }, token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ msg: 'Server error during login', error: error.message });
  }
};

// @desc    Authenticate user with Google ID token
// @route   POST /api/auth/google-login
// @access  Public
exports.googleLogin = async (req, res) => {
  const { token } = req.body; // This 'token' is the Google ID Token from the frontend

  try {
    // Verify the Google ID token with Google's API
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload(); // Contains user information from Google

    const googleId = payload['sub']; // Unique Google user ID
    const email = payload['email'];
    const name = payload['name'];
    const picture = payload['picture']; // User's profile picture URL (optional to save)

    // 1. Find user in your database by email OR googleId
    let user = await User.findOne({ $or: [{ email: email }, { googleId: googleId }] });

    if (!user) {
      // If no user found, create a new one. No password needed for Google sign-in.
      user = new User({
        email,
        name,
        googleId,
        // avatar: picture, // Optional: save profile picture URL
      });
      await user.save();
    } else if (user && !user.googleId) {
      // If user exists with this email but without a googleId (e.g., traditional signup),
      // link their Google account to the existing account.
      user.googleId = googleId;
      // Optional: Update name if Google provides a more complete name
      // user.name = name;
      await user.save();
    }
    // If user exists and already has a googleId, simply proceed (no update needed)

    // 2. Generate your own custom JWT for the user
    const customToken = generateToken(user);

    // Send your custom JWT and basic user info back to the frontend
    res.status(200).json({
      token: customToken,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error('Google ID token verification failed:', error.message);
    res.status(401).json({ msg: 'Google login failed. Invalid token or verification error.' });
  }
};
