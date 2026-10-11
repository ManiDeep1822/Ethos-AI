const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect to database
connectDB();

// Global process error resilience
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ [Server Safety]: Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('⚠️ [Server Safety]: Uncaught Exception:', error);
});

const app = express();

// Middleware
app.use(helmet());

// Dynamic CORS configuration allowing localhost, Vercel deployments, and custom CLIENT_URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://ethos-ai.vercel.app',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((s) => s.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow all legitimate client origins dynamically
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/analyzer', require('./routes/analyzerRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('AI Professional Communication Trainer API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    data: null, // Keep structure consistent
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  
  // Start keep-alive script to prevent Render from sleeping
  const startKeepAlive = require('./services/keepAlive');
  startKeepAlive();
});
