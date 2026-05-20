const mongoose = require('mongoose');
const Review = require('../models/Review');
const Order = require('../models/Order');
const sanitizeError = require('../utils/sanitizeError');
const { clearCache } = require('../middlewares/cacheMiddleware');

exports.getPublicReviews = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const [reviews, total, ratingAgg] = await Promise.all([
      Review.find({ status: 'approved' })
        .populate('user', 'name')
        .populate('medicine', 'name')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Review.countDocuments({ status: 'approved' }),
      Review.aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]),
    ]);

    const avgRating = ratingAgg.length > 0 ? Math.round(ratingAgg[0].avg * 10) / 10 : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / limit),
      avgRating,
      data: reviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.medicine) filter.medicine = req.query.medicine;

    const reviews = await Review.find(filter)
      .populate('user', 'name email')
      .populate('medicine', 'name')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.getMedicineReviews = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.medicineId)) {
    return res.status(400).json({ success: false, error: 'Invalid medicine ID' });
  }
  try {
    const reviews = await Review.find({
      medicine: req.params.medicineId,
      status: 'approved'
    })
      .populate('user', 'name')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { medicine, rating, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(medicine)) {
      return res.status(400).json({ success: false, error: 'Invalid medicine ID' });
    }

    const hasPurchased = await Order.exists({
      user: req.user.id,
      'items.medicine': medicine,
      status: { $in: ['Delivered', 'Completed'] },
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        error: 'You can only review medicines you have purchased and received.',
      });
    }

    const review = await Review.create({ medicine, rating, comment, user: req.user.id });
    await clearCache(`/api/reviews/medicine/${medicine}`);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

exports.updateReviewStatus = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    await clearCache(`/api/reviews/medicine/${review.medicine}`);
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    await clearCache(`/api/reviews/medicine/${review.medicine}`);
    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};
