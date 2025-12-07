const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ROLES, isAdmin } = require('../constants/roles');

// Protect routes - verify token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      
      // Get user from token
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin only middleware
const adminOnly = async (req, res, next) => {
  try {
    // First check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Not authorized. Please login first.' });
    }

    // Check if user is admin
    if (!isAdmin(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Only administrators can create quizzes. Please contact an admin if you need this access.' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { protect, adminOnly };

