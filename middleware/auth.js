const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');

    // Get user from token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Middleware to check if user is influencer
exports.isInfluencer = (req, res, next) => {
  if (req.user.userType !== 'influencer') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Influencers only.'
    });
  }
  next();
};

// Middleware to check if user is startup
exports.isStartup = (req, res, next) => {
  if (req.user.userType !== 'startup') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Startups only.'
    });
  }
  next();
};

