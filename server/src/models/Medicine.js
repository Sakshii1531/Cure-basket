const mongoose = require('mongoose');

const precautionEntrySchema = new mongoose.Schema(
  { label: String, status: String, description: String },
  { _id: false }
);

const medicineSchema = new mongoose.Schema({
  // ── REQUIRED CORE FIELDS ──────────────────────────────────────────────────
  title: {
    type: String,
    required: [true, 'Please add a medicine title'],
    trim: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a category'],
  },
  priceLabel: { type: String, default: 'USD' },
  packSize: {
    type: String,
    required: [true, 'Please add a pack size (e.g. 10 Tablets, 500mg Strip)'],
    trim: true,
  },
  quantityOptions: {
    type: [Number],
    required: [true, 'Please add at least one quantity option'],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: 'At least one quantity option is required',
    },
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Please add a price per unit (USD)'],
    min: [0, 'Price per unit must be non-negative'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please add a total price (USD)'],
    min: [0, 'Total price must be non-negative'],
  },
  oldPrice:    { type: Number, min: [0, 'Old price must be non-negative'] },
  discount:    { type: Number, min: [0, 'Discount must be 0–100'], max: [100, 'Discount must be 0–100'] },
  description: { type: String, trim: true },

  // ── BACKWARD-COMPAT ALIASES (auto-synced by pre-save hook) ────────────────
  name:  { type: String, trim: true }, // mirrors title
  price: { type: Number },             // mirrors pricePerUnit
  mrp:   { type: Number },             // mirrors oldPrice

  // ── PRODUCT / MEDICINAL FIELDS ────────────────────────────────────────────
  sku:              { type: Number },
  genericFor:       { type: String, trim: true },
  activeIngredient: { type: String, trim: true },
  manufacturer:     { type: String, trim: true },
  countryOrigin:    { type: String, trim: true },
  brand:            { type: mongoose.Schema.ObjectId, ref: 'Brand' },

  stock:  { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ['Active', 'Low Stock', 'Inactive'],
    default: 'Active',
  },
  image:  { type: String, default: 'no-photo.jpg' },
  images: [String],
  packages: [
    {
      label:    String,
      price:    Number,
      oldPrice: Number,
      perUnit:  Number,
      popular:  { type: Boolean, default: false },
    },
  ],

  // Renamed from safetyAdvice — keeps the same { label, status, description } structure
  precautions: [precautionEntrySchema],

  packaging:    { type: String },
  storage:      { type: String },
  prescription: { type: String, default: 'Required' },
  deliveryTime: { type: String, default: 'Usually delivers in 1-2 days' },
  uses:         { type: String }, // therapeutic / dose uses
  sideEffects:  { type: String },
  howToUse:     { type: String },
  faqs: [
    {
      question: String,
      answer:   String,
    },
  ],
  isNewAndBest: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  customValues: { type: Map, of: String },
  createdAt:    { type: Date, default: Date.now },
});

medicineSchema.pre('save', function (next) {
  if (this.title)                this.name  = this.title;
  if (this.pricePerUnit != null) this.price = this.pricePerUnit;
  if (this.oldPrice != null)     this.mrp   = this.oldPrice;
  next();
});

medicineSchema.pre('findOneAndUpdate', function (next) {
  const upd = this.getUpdate();
  if (upd.title)                upd.name  = upd.title;
  if (upd.pricePerUnit != null) upd.price = upd.pricePerUnit;
  if (upd.oldPrice != null)     upd.mrp   = upd.oldPrice;
  next();
});

module.exports = mongoose.model('Medicine', medicineSchema);
