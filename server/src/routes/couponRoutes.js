const express = require('express');
const router = express.Router();
const { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect, authorize, can } = require('../middlewares/authMiddleware');

// Public: validate a coupon code
router.post('/validate', validateCoupon);

// Admin-only routes
router.use(protect, authorize('admin', 'superadmin'));
router.get('/', can('coupons', 'read'), getCoupons);
router.post('/', can('coupons', 'write'), createCoupon);
router.put('/:id', can('coupons', 'write'), updateCoupon);
router.delete('/:id', can('coupons', 'delete'), deleteCoupon);

module.exports = router;
