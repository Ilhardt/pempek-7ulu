// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database'); // ← ini promisePool
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('🔐 Login attempt for:', username);

    // ✅ GUNAKAN ASYNC/AWAIT (BUKAN CALLBACK)
    const [results] = await db.query(
      'SELECT * FROM users WHERE username = ? AND role = ?',
      [username, 'admin']
    );

    console.log('✅ Query completed. Results found:', results.length);

    if (!results || results.length === 0) {
      console.log('❌ User not found or not admin');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const user = results[0];
    console.log('👤 User found:', { id: user.id, username: user.username, role: user.role });

    // Verify password
    console.log('⏱️ Verifying password...');
    const startTime = Date.now();
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ Password verification took ${duration}ms`);
    
    if (!validPassword) {
      console.log('❌ Invalid password');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    console.log('✅ Password verified!');

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful - sending response');

    res.json({
      success: true,
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// GET /api/auth/verify
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;