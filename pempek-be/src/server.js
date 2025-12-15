const express = require('express');
const cors = require('cors');
require('dotenv').config();

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const businessInfoRoutes = require('./routes/businessInfoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Railway compatible
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Railway will use env variable
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers - Penting untuk upload gambar QRIS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ============ LOGGING MIDDLEWARE ============
app.use((req, res, next) => {
  console.log('📨 ===== INCOMING REQUEST =====');
  console.log('⏰ Time:', new Date().toISOString());
  console.log('🔗 Method:', req.method);
  console.log('🌐 URL:', req.url);
  console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
  
  if (req.body) {
    const bodyCopy = { ...req.body };
    // Hide sensitive/large data in logs
    if (bodyCopy.payment_proof) {
      bodyCopy.payment_proof = `[BASE64 DATA - ${bodyCopy.payment_proof.length} chars]`;
    }
    if (bodyCopy.qris_image) {
      bodyCopy.qris_image = `[BASE64 DATA - ${bodyCopy.qris_image.length} chars]`;
    }
    console.log('📦 Body:', JSON.stringify(bodyCopy, null, 2));
  }
  
  console.log('==============================');
  next();
});
// ============ END LOGGING MIDDLEWARE ============

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/business-info', businessInfoRoutes);

// Health check - Railway monitoring
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Pempek 7 Ulu API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    port: PORT,
    routes: [
      'GET  /api/health',
      'POST /api/auth/login',
      'GET  /api/menu',
      'GET  /api/orders',
      'POST /api/orders',
      'GET  /api/admin/orders',
      'GET  /api/business-info',
      'PUT  /api/business-info'
    ]
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Pempek 7 Ulu API',
    version: '1.0.0',
    platform: 'Railway',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      menu: '/api/menu',
      orders: '/api/orders',
      admin: '/api/admin',
      businessInfo: '/api/business-info'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ ===== ERROR =====');
  console.error('Error stack:', err.stack);
  console.error('Error message:', err.message);
  console.error('====================');
  
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  console.log('⚠️ 404 Not Found:', req.method, req.url);
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.url,
    method: req.method,
    availableRoutes: [
      '/api/health',
      '/api/auth/login',
      '/api/menu',
      '/api/orders',
      '/api/admin',
      '/api/business-info'
    ]
  });
});

// Start server - Railway akan bind ke 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 ====================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🚂 Platform: Railway`);
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL || 'All origins'}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log('📚 Available Routes:');
  console.log('   - POST /api/auth/login');
  console.log('   - GET  /api/menu');
  console.log('   - GET  /api/orders');
  console.log('   - POST /api/orders');
  console.log('   - GET  /api/admin/orders');
  console.log('   - PUT  /api/admin/orders/:id/status');
  console.log('   - GET  /api/business-info (Public)');
  console.log('   - PUT  /api/business-info (Admin Only)');
  console.log('🚀 ====================================');
});