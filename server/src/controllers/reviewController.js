const mongoose = require('mongoose');
const Review = require('../models/Review');
const sanitizeError = require('../utils/sanitizeError');
const { clearCache } = require('../middlewares/cacheMiddleware');

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
    const review = await Review.create({ ...req.body, user: req.user.id });
    await clearCache(`/api/reviews/medicine/${req.body.medicine}`);
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
