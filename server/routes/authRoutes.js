// server/routes/authRoutes.js
const express = require('express');
const { signup, login, googleLogin } = require('../controllers/authController'); // ✅ Import googleLogin

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin); // ✅ Add this route for Google OAuth login

module.exports = router;
