const express = require('express');
const router = express.Router();
const { getSummary, getRevenueChart, getUsersChart } = require('../controllers/analyticsController');
const { protect, authorize, can } = require('../middlewares/authMiddleware');

router.get('/summary', protect, authorize('admin', 'superadmin'), getSummary);
router.get('/revenue', protect, authorize('admin', 'superadmin'), can('analytics', 'read'), getRevenueChart);
router.get('/users', protect, authorize('admin', 'superadmin'), can('analytics', 'read'), getUsersChart);

module.exports = router;
