const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize, can } = require('../middlewares/authMiddleware');
const { cache } = require('../middlewares/cacheMiddleware');
const validate = require('../middlewares/validate');
const { createOrderRules, updateOrderStatusRules } = require('../validators/orderValidators');

router
  .route('/')
  .get(protect, authorize('admin', 'superadmin'), can('orders', 'read'), cache(60), getOrders)
  .post(protect, createOrderRules, validate, createOrder);

router.get('/my-orders', protect, cache(60), getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, authorize('admin', 'superadmin'), can('orders', 'write'), updateOrderStatusRules, validate, updateOrderStatus);

module.exports = router;
