const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  medicine: {
    type: mongoose.Schema.ObjectId,
    ref: 'Medicine',
    required: true
  },
  packageLabel: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Dispensed', 'Rejected'],
    default: 'Pending'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
