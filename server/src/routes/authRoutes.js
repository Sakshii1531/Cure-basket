const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, logout, getMe, forgotPassword, resetPassword, addAddress, updateAddress, deleteAddress, forgotPasswordOTP, verifyOTP, resetPasswordOTP } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { registerRules, loginRules } = require('../validators/authValidators');

const router = express.Router();

// Strict limiter: 10 attempts per 15 minutes per IP on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 1000,
  message: { success: false, error: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/forgot-password-otp', authLimiter, forgotPasswordOTP);
router.post('/verify-otp', authLimiter, verifyOTP);
router.post('/reset-password-otp', authLimiter, resetPasswordOTP);

router.post('/me/addresses', protect, addAddress);
router.put('/me/addresses/:addressId', protect, updateAddress);
router.delete('/me/addresses/:addressId', protect, deleteAddress);

module.exports = router;
