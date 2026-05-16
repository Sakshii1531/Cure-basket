const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  medicine: { type: mongoose.Schema.ObjectId, ref: 'Medicine', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

// One review per user per medicine
reviewSchema.index({ user: 1, medicine: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
