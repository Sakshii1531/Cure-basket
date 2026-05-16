const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router
  .route('/:type')
  .get(protect, authorize('admin', 'superadmin'), getSettings)
  .put(protect, authorize('admin', 'superadmin'), updateSettings);

module.exports = router;
