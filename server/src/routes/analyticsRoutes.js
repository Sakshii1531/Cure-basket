const express = require('express');
const router = express.Router();
const { getSummary, getRevenueChart } = require('../controllers/analyticsController');
const { protect, authorize, can } = require('../middlewares/authMiddleware');

router.get('/summary', protect, authorize('admin', 'superadmin'), getSummary);
router.get('/revenue', protect, authorize('admin', 'superadmin'), can('analytics', 'read'), getRevenueChart);

module.exports = router;
