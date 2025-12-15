// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/database'); // promisePool
const { authenticateToken, isAdmin } = require('../middleware/auth');

// GET /api/admin/profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('📋 Fetching admin profile for user:', req.user);
    
    const userId = req.user.id;
    
    // ✅ GUNAKAN ASYNC/AWAIT
    const [results] = await db.query(
      'SELECT id, username, role, created_at FROM users WHERE id = ? AND role = ?',
      [userId, 'admin']
    );

    console.log('🔍 Query results:', results);

    if (!results || results.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
    }

    console.log('✅ Admin found:', results[0]);

    res.json({ 
      success: true, 
      data: results[0]
    });
  } catch (error) {
    console.error('❌ Error fetching admin profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET /api/admin/stats
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    // ✅ GUNAKAN ASYNC/AWAIT
    const [[{ count: totalOrders }]] = await db.query('SELECT COUNT(*) as count FROM orders');
    const [[{ count: pendingOrders }]] = await db.query('SELECT COUNT(*) as count FROM orders WHERE status = ?', ['pending']);
    const [[{ total: totalRevenue }]] = await db.query('SELECT SUM(total_price) as total FROM orders WHERE status = ?', ['confirmed']);
    const [[{ count: totalProducts }]] = await db.query('SELECT COUNT(*) as count FROM menu_items');

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue || 0,
        totalProducts
      }
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;