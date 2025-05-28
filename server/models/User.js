const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    // IMPORTANT: Make password not required if you allow Google-only accounts.
    // If a user signs up via Google, they won't have a password in your DB.
    required: false, // Changed from true to false
  },
  googleId: { // NEW FIELD: To store the unique Google ID
    type: String,
    unique: true,
    sparse: true // Allows null values, important if not all users have a googleId
  },
  // You might want to add a field for profile picture if you plan to use it from Google
  // avatar: {
  //   type: String,
  // },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before save
// This 'pre' hook will now only run if the 'password' field is present and modified.
userSchema.pre('save', async function (next) {
  // Only hash password if it's provided AND it's being modified/created
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare hashed password (for traditional login)
userSchema.methods.comparePassword = function (password) {
  // Only try to compare if a password exists for the user
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
