const Coupon = require('../models/Coupon');
const sanitizeError = require('../utils/sanitizeError');

exports.getCoupons = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      Coupon.find().sort('-createdAt').skip(skip).limit(limit),
      Coupon.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: coupons.length,
      total,
      pagination: { page, limit, pages: Math.ceil(total / limit) },
      data: coupons,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) return res.status(404).json({ success: false, error: 'Coupon not found' });
    res.status(200).json({ success: true, data: coupon });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, error: 'Coupon not found' });
    await coupon.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

// Public — validates a coupon code against an order total and increments usedCount
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Please provide a coupon code' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return res.status(404).json({ success: false, error: 'Invalid or inactive coupon' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ success: false, error: 'Coupon has expired' });
    }
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, error: 'Coupon usage limit reached' });
    }
    if (orderTotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        error: `Minimum order amount of $${coupon.minOrder} required`,
      });
    }

    let discount =
      coupon.discountType === 'percent'
        ? (orderTotal * coupon.value) / 100
        : coupon.value;

    if (coupon.maxDiscount !== null) discount = Math.min(discount, coupon.maxDiscount);
    discount = Math.min(discount, orderTotal);
    discount = Math.round(discount * 100) / 100;
    const finalTotal = Math.round(Math.max(0, orderTotal - discount) * 100) / 100;

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
        minOrder: coupon.minOrder || 0,
        discount,
        finalTotal,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ 
      isActive: true, 
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    }).sort('-createdAt');
    res.status(200).json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};
