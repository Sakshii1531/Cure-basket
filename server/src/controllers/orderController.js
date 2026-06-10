const mongoose = require('mongoose');
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const sanitizeError = require('../utils/sanitizeError');
const { clearCache } = require('../middlewares/cacheMiddleware');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const { isStockUnavailable, isQuantityInsufficient } = require('../utils/stockUtils');

  let session = null;
  let useTransaction = false;
  try {
    const topoType = mongoose.connection.client?.topology?.description?.type;
    const hasReplicaSet = topoType && (topoType.includes('ReplicaSet') || topoType === 'Sharded');
    if (hasReplicaSet) {
      session = await mongoose.startSession();
      session.startTransaction();
      useTransaction = true;
    }
  } catch (sessionErr) {
    session = null;
    useTransaction = false;
  }

  try {
    const { items, shippingAddress, paymentStatus, prescriptionId } = req.body;

    if (!items || items.length === 0) {
      if (useTransaction) await session.abortTransaction();
      return res.status(400).json({ success: false, error: 'No items in order', message: 'No items in order' });
    }

    const medicineIds = items.map((i) => i.medicine);
    const queryOpts = {};
    if (session) queryOpts.session = session;

    const medicines = await Medicine.find({ _id: { $in: medicineIds } }, null, queryOpts).select('price stock name prescription');
    const medicineMap = Object.fromEntries(medicines.map((m) => [m._id.toString(), m]));

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const med = medicineMap[item.medicine?.toString()];
      if (!med) {
        if (useTransaction) await session.abortTransaction();
        return res.status(400).json({ success: false, error: `Medicine not found: ${item.medicine}`, message: `Medicine not found: ${item.medicine}` });
      }
      if (isStockUnavailable(med)) {
        if (useTransaction) await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Medicine is out of stock',
          error: 'Medicine is out of stock',
        });
      }
      if (isQuantityInsufficient(med, item.quantity)) {
        if (useTransaction) await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Only ${med.stock} units available`,
          error: `Only ${med.stock} units available`,
        });
      }
      orderItems.push({ medicine: med._id, name: med.name, price: med.price, quantity: item.quantity });
      totalAmount += med.price * item.quantity;
    }

    // Enforce prescription requirement: any medicine with prescription === 'Required'
    // must have at least a submitted (Pending/Reviewed/Dispensed) prescription from this user.
    // Admin will review the prescription after the order is placed.
    const rxRequired = medicines.filter(m => m.prescription === 'Required');
    if (rxRequired.length > 0) {
      // Accept any prescription that has been submitted (not Rejected)
      const submittedRx = await Prescription.find({
        user: req.user.id,
        status: { $in: ['Pending', 'Reviewed', 'Dispensed'] },
      }, null, queryOpts).select('_id');

      if (submittedRx.length === 0) {
        if (useTransaction) await session.abortTransaction();
        return res.status(403).json({
          success: false,
          error: `A prescription is required for one or more medicines in your order. Please upload your prescription to proceed.`,
        });
      }
    }

    // Atomic per-item stock decrement — condition and update in one operation,
    // preventing the race window between the earlier stock check and the write.
    const decrementedItems = [];
    for (const item of orderItems) {
      const updateOpts = { new: true };
      if (session) updateOpts.session = session;

      const updated = await Medicine.findOneAndUpdate(
        { _id: item.medicine, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        updateOpts
      );

      if (!updated) {
        if (!useTransaction) {
          for (const dec of decrementedItems) {
            await Medicine.updateOne({ _id: dec.medicine }, { $inc: { stock: dec.quantity } });
          }
        } else {
          await session.abortTransaction();
        }

        const currentMed = await Medicine.findById(item.medicine);
        if (!currentMed || isStockUnavailable(currentMed)) {
          return res.status(400).json({
            success: false,
            message: 'Medicine is out of stock',
            error: 'Medicine is out of stock',
          });
        } else {
          return res.status(400).json({
            success: false,
            message: `Only ${currentMed.stock} units available`,
            error: `Only ${currentMed.stock} units available`,
          });
        }
      }
      decrementedItems.push(item);
    }

    const createOpts = {};
    if (session) createOpts.session = session;

    const [order] = await Order.create([{
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentStatus: paymentStatus || 'Pending',
    }], createOpts);

    if (useTransaction) {
      await session.commitTransaction();
    }

    await clearCache('/api/orders');

    // Link the prescription to this order — fire-and-forget.
    // Prefer the specific prescription uploaded during this checkout
    // (prescriptionId sent by the client); otherwise, when the order actually
    // requires one, fall back to the user's most recent unlinked submitted
    // prescription. Scoped to the user with order:null so we never hijack a
    // prescription that's already tied to another order or belongs elsewhere.
    (async () => {
      if (prescriptionId) {
        await Prescription.updateOne(
          { _id: prescriptionId, user: req.user.id, order: null },
          { $set: { order: order._id } }
        );
      } else if (rxRequired.length > 0) {
        const latestRx = await Prescription.findOne({
          user: req.user.id,
          status: { $in: ['Pending', 'Reviewed', 'Dispensed'] },
          order: null,
        }).sort('-createdAt').select('_id');
        if (latestRx) {
          await Prescription.updateOne({ _id: latestRx._id }, { $set: { order: order._id } });
        }
      }
    })().catch(() => {});

    // Send order confirmation email — fire-and-forget
    User.findById(req.user.id).select('name email').then((user) => {
      if (!user?.email) return;
      const itemRows = orderItems.map(item =>
        `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;">${item.name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;text-align:center;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#333;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
      ).join('');
      sendEmail({
        to: user.email,
        subject: `CureBasket — Order Confirmed #${order._id.toString().slice(-8).toUpperCase()}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
            <div style="background:#006D6D;padding:32px 24px;text-align:center;border-radius:8px 8px 0 0;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:-0.5px;">CureBasket</h1>
              <p style="color:#b2dfdf;margin:6px 0 0;font-size:13px;">Order Confirmation</p>
            </div>
            <div style="padding:32px 24px;">
              <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 4px;">Thank you, ${user.name}!</h2>
              <p style="color:#555;font-size:14px;margin:0 0 24px;">Your order has been placed successfully and is being processed.</p>
              <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="margin:0 0 6px;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Order ID</p>
                <p style="margin:0;font-size:15px;font-weight:700;color:#006D6D;font-family:monospace;">#${order._id.toString().slice(-8).toUpperCase()}</p>
              </div>
              <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                <thead>
                  <tr style="background:#f0fafa;">
                    <th style="padding:10px 12px;text-align:left;font-size:11px;color:#006D6D;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Medicine</th>
                    <th style="padding:10px 12px;text-align:center;font-size:11px;color:#006D6D;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
                    <th style="padding:10px 12px;text-align:right;font-size:11px;color:#006D6D;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Amount</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>
              <div style="text-align:right;border-top:2px solid #006D6D;padding-top:12px;">
                <span style="font-size:16px;font-weight:700;color:#1a1a1a;">Total: $${totalAmount.toFixed(2)}</span>
              </div>
              ${shippingAddress ? `
              <div style="margin-top:24px;background:#f9f9f9;border-radius:8px;padding:16px;">
                <p style="margin:0 0 6px;font-size:12px;color:#999;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Delivering to</p>
                <p style="margin:0;font-size:13px;color:#333;">${typeof shippingAddress === 'string' ? shippingAddress : Object.values(shippingAddress).filter(Boolean).join(', ')}</p>
              </div>` : ''}
              <div style="margin-top:28px;background:#f0fafa;border-left:4px solid #006D6D;padding:16px 20px;border-radius:4px;">
                <p style="margin:0;color:#006D6D;font-size:13px;">
                  We'll notify you when your order is out for delivery. Expected delivery: <strong>1–2 business days</strong>.
                </p>
              </div>
            </div>
            <div style="border-top:1px solid #f0f0f0;padding:16px 24px;text-align:center;">
              <p style="color:#aaa;font-size:11px;margin:0;">© CureBasket — Your trusted online pharmacy</p>
            </div>
          </div>
        `,
      }).catch(() => {});
    }).catch(() => {});

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    if (useTransaction) {
      try {
        await session.abortTransaction();
      } catch (abortErr) {}
    }
    res.status(400).json({ success: false, error: sanitizeError(err) });
  } finally {
    if (session) {
      session.endSession();
    }
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
    if (req.query.user) filter.user = req.query.user;

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

// @desc    Get single order by ID (owner or admin)
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.medicine', 'name image');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const isOwner = order.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, data: order });
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
