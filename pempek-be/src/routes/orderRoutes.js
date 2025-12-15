// backend/routes/orderRoutes.js - UPDATED

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Guest checkout 
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);

// Upload payment proof 
router.patch('/:id/payment-proof', orderController.uploadPaymentProof);

// Customer dapat cek order mereka dengan phone number
router.get('/customer/by-phone/:phone', orderController.getOrdersByPhone);
// ====================================================

// Admin routes 
router.get('/', authenticateToken, isAdmin, orderController.getAllOrders);
router.patch('/:id/status', authenticateToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;