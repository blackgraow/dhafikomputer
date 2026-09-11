const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDb } = require('./config/db');
const { initDb, ensureDbConnected } = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const brandRoutes = require('./routes/brandRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const masterDealerRoutes = require('./routes/masterDealerRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const laptopRoutes = require('./routes/laptopRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check Route
app.get('/api/health', (req, res) => {
// Root & Health Check Routes
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend Dhafi Komputer Inventory API is running.',
    timestamp: new Date().toISOString()
  });
});

// Non-blocking DB readiness check middleware for API data routes
app.use(async (req, res, next) => {
  try {
    if (ensureDbConnected) {
      await ensureDbConnected();
    }
  } catch (e) {
    // Non-fatal, fallback mode handles offline scenario
  }
  next();
});

// API Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/master-dealers', masterDealerRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/laptops', laptopRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} tidak ditemukan.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal pada server.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Server backend Dhafi Komputer berjalan pada port ${PORT}`);
  console.log(`📡 Health check URL: http://localhost:${PORT}/api/health`);
  
  // Try initializing DB tables & seeds
  await initDb();
});
// Export Express app for Vercel Serverless Functions
module.exports = app;

// Start Server locally only when run directly
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`🚀 Server backend Dhafi Komputer berjalan pada port ${PORT}`);
    console.log(`📡 Health check URL: http://localhost:${PORT}/api/health`);
    
    // Try initializing DB tables & seeds locally
    await initDb();
  });
}
