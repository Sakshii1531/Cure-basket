const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 30 : 1000,
  message: { success: false, error: 'Too many uploads. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', protect, uploadLimiter, upload.single('file'), uploadImage);

module.exports = router;
