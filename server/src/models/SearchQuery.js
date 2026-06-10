const mongoose = require('mongoose');

const searchQuerySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  originalQuery: {
    type: String,
    required: true,
    trim: true,
  },
  count: {
    type: Number,
    required: true,
    default: 1,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index to ensure query searches are extremely fast and sorted results are optimized
searchQuerySchema.index({ count: -1, updatedAt: -1 });

module.exports = mongoose.model('SearchQuery', searchQuerySchema);
