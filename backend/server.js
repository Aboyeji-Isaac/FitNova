import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import config from './config.js';
import authRoutes from './routes/auth.js';
import challengeRoutes from './routes/challenges.js';
import leaderboardRoutes from './routes/leaderboard.js';
import onboardingRoutes from './routes/onboarding.js';
import progressRoutes from './routes/progress.js';
import userRoutes from './routes/users.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createRateLimiter } from './middleware/rateLimiter.js';
import { initializeFirebase } from './services/firebaseAdmin.js';
import { setupSocketHandlers } from './services/socketHandlers.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Initialize Firebase Admin SDK
initializeFirebase();

// Middleware
app.use(cors(config.cors));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
if (config.rateLimiting.enabled) {
  app.use(createRateLimiter(config.rateLimiting.windowMs, config.rateLimiting.maxRequests));
}

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';
    console.log(
      `[${logLevel.toUpperCase()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Socket.IO setup
setupSocketHandlers(io);

const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log(`🚀 FitNova Backend running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO listening for real-time updates`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔒 CORS enabled for: ${config.cors.origin}`);
});

export { io };

