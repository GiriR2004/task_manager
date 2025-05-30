const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// 🕒 Import cron reminder scheduler
require('./reminderscheduler'); // Runs the email reminder logic

dotenv.config();

// Debugging port
console.log('PORT from .env:', process.env.PORT);

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;

// ✅ CORS configuration to allow frontend domain
const allowedOrigins = [
  'https://task-manager-frontend1-4wwx.onrender.com',
  'http://localhost:5173', // for local development
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // enable set-cookie and auth headers
};

app.use(cors(corsOptions));
app.use(express.json());

// API routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();
