const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a medicine name'],
    trim: true
  },
  genericName: {
    type: String,
    required: [true, 'Please add a generic name'],
    trim: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: 'Brand'
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0
  },
  status: {
    type: String,
    enum: ['Active', 'Low Stock', 'Inactive'],
    default: 'Active'
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  isNewAndBest: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  customValues: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Medicine', medicineSchema);
