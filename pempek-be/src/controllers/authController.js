const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Admin login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Get user from database
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? AND role = "admin"',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    const user = users[0];
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      }
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token verification failed'
    });
  }
};