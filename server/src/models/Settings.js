const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

settingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
