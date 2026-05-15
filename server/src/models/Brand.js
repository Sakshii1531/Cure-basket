const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a brand name'],
    unique: true,
    trim: true
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Brand', brandSchema);
