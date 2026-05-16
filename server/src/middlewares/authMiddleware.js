const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies JWT from httpOnly cookie and attaches req.user
exports.protect = async (req, res, next) => {
  const token = req.cookies?.cb_token;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate('customRole');
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

// Simple role gate — used for broad checks (e.g. admin or superadmin only)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Granular permission gate — checks module + action against the Role's permission matrix
exports.can = (module, action) => {
  return (req, res, next) => {
    if (!req.user.can(module, action)) {
      return res.status(403).json({
        success: false,
        error: `You do not have '${action}' permission on '${module}'`,
      });
    }
    next();
  };
};
