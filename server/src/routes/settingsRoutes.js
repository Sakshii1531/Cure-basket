const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, authorize, can } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/public/:type', getSettings);

router
  .route('/:type')
  .get(protect, authorize('admin', 'superadmin'), can('settings', 'read'), getSettings)
  .put(protect, authorize('admin', 'superadmin'), can('settings', 'write'), updateSettings);

module.exports = router;
