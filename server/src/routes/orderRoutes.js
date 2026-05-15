const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

router
  .route('/')
  .get(protect, authorize('admin'), getOrders)
  .post(protect, createOrder);

router.get('/my-orders', protect, getMyOrders);

router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
