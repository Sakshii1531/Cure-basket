const express = require('express');
const router = express.Router();
const { getSummary, getRevenueChart } = require('../controllers/analyticsController');
const { protect, authorize, can } = require('../middlewares/authMiddleware');

router.use(protect, authorize('admin', 'superadmin'), can('analytics', 'read'));

router.get('/summary', getSummary);
router.get('/revenue', getRevenueChart);

module.exports = router;
