const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', menuController.getAllMenu);
router.get('/all', authenticateToken, isAdmin, menuController.getAllMenuAdmin);
router.get('/:id', menuController.getMenuById);

// Admin routes
router.post('/', authenticateToken, isAdmin, menuController.createMenu);
router.put('/:id', authenticateToken, isAdmin, menuController.updateMenu);
router.delete('/:id', authenticateToken, isAdmin, menuController.deleteMenu);

module.exports = router;