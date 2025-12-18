// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// GET /api/admin/profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('📋 Fetching admin profile for user:', req.user);
    
    const userId = req.user.id;
    
    const { data, error } = await supabase
      .from('users')
      .select('id, username, role, created_at')
      .eq('id', userId)
      .eq('role', 'admin')
      .single();

    if (error) {
      console.error('🔍 Query error:', error);
      throw error;
    }

    console.log('🔍 Query results:', data);

    if (!data) {
      return res.status(404).json({ 
        success: false,
        message: 'Admin not found' 
      });
    }

    console.log('✅ Admin found:', data);

    res.json({ 
      success: true, 
      data: data
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
    // Get total orders
    const { count: totalOrders, error: e1 } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (e1) throw e1;

    // Get pending orders
    const { count: pendingOrders, error: e2 } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    if (e2) throw e2;

    // Get total revenue (confirmed orders)
    const { data: revenueData, error: e3 } = await supabase
      .from('orders')
      .select('total_price')
      .eq('status', 'confirmed');
    
    if (e3) throw e3;

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

    // Get total products
    const { count: totalProducts, error: e4 } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true });
    
    if (e4) throw e4;

    res.json({
      success: true,
      data: {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        totalRevenue: totalRevenue,
        totalProducts: totalProducts || 0
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