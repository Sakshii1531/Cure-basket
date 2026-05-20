const mongoose = require('mongoose');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const sanitizeError = require('../utils/sanitizeError');
const { clearCache } = require('../middlewares/cacheMiddleware');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentStatus } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    // Fetch all medicines in one query to recalculate the total server-side
    const medicineIds = items.map((i) => i.medicine);
    const medicines = await Medicine.find({ _id: { $in: medicineIds } }).select('price stock name');

    const medicineMap = Object.fromEntries(medicines.map((m) => [m._id.toString(), m]));

    // Validate stock and compute server-authoritative total
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const med = medicineMap[item.medicine?.toString()];
      if (!med) {
        return res.status(400).json({ success: false, error: `Medicine not found: ${item.medicine}` });
      }
      if (med.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for "${med.name}" (available: ${med.stock})`,
        });
      }
      orderItems.push({ medicine: med._id, name: med.name, price: med.price, quantity: item.quantity });
      totalAmount += med.price * item.quantity;
    }

    // Atomic per-item stock decrement — condition and update in one operation,
    // preventing the race window between the earlier stock check and the write.
    for (const item of orderItems) {
      const updated = await Medicine.findOneAndUpdate(
        { _id: item.medicine, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (!updated) {
        return res.status(400).json({
          success: false,
          error: `"${item.name}" went out of stock during checkout. Please refresh and try again.`,
        });
      }
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: paymentStatus || 'Pending',
    });

    await clearCache('/api/orders');
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.medicine', 'name image')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .populate('items.medicine', 'name image')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    await clearCache('/api/orders');
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};
