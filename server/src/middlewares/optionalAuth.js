const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Like `protect`, but never blocks the request. Used for customer-facing chat
// endpoints where anonymous visitors are allowed: if a valid token is present we
// attach `req.user` (so we can link the conversation + answer order questions),
// otherwise we simply continue without it.
const optionalAuth = async (req, res, next) => {
  const cookieToken = req.cookies?.cb_token;
  const bearerToken = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  const candidates = [cookieToken, bearerToken].filter(Boolean);

  for (const token of candidates) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        break;
      }
    } catch (err) {
      // Ignore invalid/expired tokens — anonymous access is allowed here.
    }
  }

  next();
};

module.exports = optionalAuth;
