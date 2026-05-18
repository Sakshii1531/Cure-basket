const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies JWT from httpOnly cookie or Authorization header and attaches req.user.
// Both tokens are tried in order so a stale cookie never blocks a valid Bearer token.
exports.protect = async (req, res, next) => {
  const cookieToken = req.cookies?.cb_token;
  const bearerToken = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const candidates = [cookieToken, bearerToken].filter(Boolean);

  if (candidates.length === 0) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  for (const token of candidates) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).populate('customRole');
      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      if (err.name !== 'JsonWebTokenError' && err.name !== 'TokenExpiredError' && err.name !== 'NotBeforeError') {
        // Non-JWT error (e.g. DB connection issue) — don't swallow as auth failure
        return res.status(500).json({ success: false, error: 'Server error during authentication' });
      }
      // JWT error — try the next candidate
    }
  }

  return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
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
