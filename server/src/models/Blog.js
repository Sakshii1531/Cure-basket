const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
}, { _id: false });

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Please add a title'], trim: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  author: { type: String, default: 'CureBasket Team' },
  coverImage: { type: String, default: '' },
  sections: [sectionSchema],
  tags: [{ type: String, trim: true }],
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Auto-generate slug from title
blogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
