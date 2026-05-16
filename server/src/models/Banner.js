const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Please add a title'], trim: true },
  image: { type: String, required: [true, 'Please add an image URL'] },
  link: { type: String, default: '' },
  position: {
    type: String,
    enum: ['main', 'promo', 'category', 'popup'],
    default: 'main',
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Banner', bannerSchema);
