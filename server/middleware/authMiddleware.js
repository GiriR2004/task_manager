const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Your user model

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    console.log('Decoded token:', decoded);

    // Find user by email instead of ID
    const user = await User.findOne({ email: decoded.email }).select('-password');

    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user info to req.user (including email)
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    console.error('Error in protect middleware:', error.message);
    return res.status(401).json({ message: 'Token not valid' });
  }
};

module.exports = protect;
