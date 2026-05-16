const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');
const { cache } = require('../middlewares/cacheMiddleware');
const validate = require('../middlewares/validate');
const { createOrderRules, updateOrderStatusRules } = require('../validators/orderValidators');

router
  .route('/')
  .get(protect, authorize('admin', 'superadmin'), cache(60), getOrders)
  .post(protect, createOrderRules, validate, createOrder);

router.get('/my-orders', protect, cache(60), getMyOrders);

router.put('/:id/status', protect, authorize('admin', 'superadmin'), updateOrderStatusRules, validate, updateOrderStatus);

module.exports = router;
