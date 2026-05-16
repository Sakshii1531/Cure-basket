const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/:type')
  .get(protect, authorize('admin'), getSettings)
  .put(protect, authorize('admin'), updateSettings);

module.exports = router;
