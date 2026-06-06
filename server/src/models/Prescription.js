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
    default: null,
  },
  packageLabel: {
    type: String,
  },
  quantity: {
    type: Number,
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

// ── Indexes ─────────────────────────────────────────────────────────────────
prescriptionSchema.index({ user: 1, createdAt: -1 });   // getMyPrescriptions
prescriptionSchema.index({ status: 1, createdAt: -1 }); // admin queue filter

module.exports = mongoose.model('Prescription', prescriptionSchema);
