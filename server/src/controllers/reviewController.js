const Review = require('../models/Review');

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
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMedicineReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      medicine: req.params.medicineId,
      status: 'approved'
    })
      .populate('user', 'name')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
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
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });
    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
