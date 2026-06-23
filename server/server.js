import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import configureCloudinary from './config/cloudinary.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import milestoneRoutes from './routes/milestoneRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import reputationRoutes from './routes/reputationRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';

// Socket handler
import { initializeSocket } from './socket/socketHandler.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Configure Cloudinary
configureCloudinary();

// Initialize Express
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Make io accessible to routes
app.set('io', io);

// Initialize socket handler
initializeSocket(io);

// ---------------------
// Middleware Stack
// ---------------------

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// ---------------------
// API Routes
// ---------------------
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/reputation', reputationRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/availability', availabilityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// ---------------------
// Start Server
// ---------------------
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`\n🚀 WorkSphere Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

export { app, io };
