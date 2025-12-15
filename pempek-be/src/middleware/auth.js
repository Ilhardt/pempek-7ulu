// src/middleware/auth.js
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('❌ Token verification failed:', err.message);
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }
    
    console.log('✅ Token verified for user:', user);
    req.user = user; // { id, username, role }
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  next();
};

