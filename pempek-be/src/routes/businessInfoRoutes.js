// routes/businessInfoRoutes.js
const express = require('express');
const router = express.Router();
const BusinessInfoController = require('../controllers/businessInfoController');
const { authenticateToken, isAdmin } = require('../middleware/auth'); // ⭐ Destructure

// Public route - Get business info
router.get('/', BusinessInfoController.getBusinessInfo);

// Protected route - Update business info (hanya admin)
router.put('/', authenticateToken, isAdmin, BusinessInfoController.updateBusinessInfo); // ⭐ Gunakan kedua middleware

module.exports = router;