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
    // Only present for the 'upload' method; fax/email submissions have no file.
    // Per-method requiredness is enforced in the controller.
  },
  submissionMethod: {
    type: String,
    enum: ['upload', 'fax', 'email'],
    default: 'upload',
  },
  // Fax method: the fax number the customer sent the prescription from.
  faxNumber: {
    type: String,
  },
  // Email method: the email address the customer sent the prescription from.
  senderEmail: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Dispensed', 'Rejected'],
    default: 'Pending'
  },
  notes: {
    type: String
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ── Indexes ─────────────────────────────────────────────────────────────────
prescriptionSchema.index({ user: 1, createdAt: -1 });   // getMyPrescriptions
prescriptionSchema.index({ status: 1, createdAt: -1 }); // admin queue filter
prescriptionSchema.index({ order: 1 });                 // order linkage lookup

module.exports = mongoose.model('Prescription', prescriptionSchema);
