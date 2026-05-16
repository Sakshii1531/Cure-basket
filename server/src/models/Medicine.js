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
  mrp: {
    type: Number,
    required: [true, 'Please add MRP (Original Price)']
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
  images: [String], // Array for multiple product images
  packages: [
    {
      label: String, // e.g., "10 Tablets"
      price: Number,
      mrp: Number, // Original price for this package
      perUnit: Number, // e.g., 1.20
      popular: { type: Boolean, default: false }
    }
  ],
  // Medicinal Details
  manufacturer: String,
  saltComposition: String,
  packaging: String, // e.g., "10 Tablets in 1 Strip"
  storage: String,
  prescription: { type: String, default: 'Required' },
  deliveryTime: { type: String, default: 'Usually delivers in 1-2 days' },
  uses: String,
  sideEffects: String,
  howToUse: String,
  safetyAdvice: [
    {
      label: String, // e.g., "Alcohol"
      status: String, // e.g., "Unsafe"
      description: String
    }
  ],
  faqs: [
    {
      question: String,
      answer: String
    }
  ],
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
