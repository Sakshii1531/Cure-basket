const mongoose = require('mongoose');

const LEGACY_COUNTRY_MAP = {
  'INDIA': { countryCode: 'IN', countryName: 'India', dialCode: '+91' },
  'UNITED STATES': { countryCode: 'US', countryName: 'United States', dialCode: '+1' },
  'USA': { countryCode: 'US', countryName: 'United States', dialCode: '+1' },
  'US': { countryCode: 'US', countryName: 'United States', dialCode: '+1' },
  'CANADA': { countryCode: 'CA', countryName: 'Canada', dialCode: '+1' },
  'UNITED KINGDOM': { countryCode: 'GB', countryName: 'United Kingdom', dialCode: '+44' },
  'UK': { countryCode: 'GB', countryName: 'United Kingdom', dialCode: '+44' },
  'AUSTRALIA': { countryCode: 'AU', countryName: 'Australia', dialCode: '+61' },
  'SINGAPORE': { countryCode: 'SG', countryName: 'Singapore', dialCode: '+65' },
};

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
  countryOrigin: {
    countryCode: {
      type: String,
      default: null,
      trim: true,
    },
    countryName: {
      type: String,
      default: null,
      trim: true,
    },
    dialCode: {
      type: String,
      default: null,
      trim: true,
    },
  },
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
      price:    Number,   // selling price for the whole pack
      oldPrice: Number,   // original price (for strikethrough + discount %)
      units:    Number,   // how many units this pack contains
      perUnit:  Number,   // auto-computed = price / units
      popular:  { type: Boolean, default: false }, // "Best Value" badge
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

medicineSchema.pre('validate', function () {
  if (this.countryOrigin && typeof this.countryOrigin === 'string') {
    const rawVal = this.countryOrigin.trim();
    const upperVal = rawVal.toUpperCase();
    const resolved = LEGACY_COUNTRY_MAP[upperVal];
    this.countryOrigin = {
      countryCode: resolved ? resolved.countryCode : null,
      countryName: resolved ? resolved.countryName : rawVal,
      dialCode: resolved ? resolved.dialCode : null,
    };
  }

  if (this.name && !this.title)                this.title  = this.name;
  if (this.title && !this.name)                this.name   = this.title;
  
  if (this.price != null && this.pricePerUnit == null) this.pricePerUnit = this.price;
  if (this.pricePerUnit != null && this.price == null) this.price       = this.pricePerUnit;
  
  if (this.mrp != null && this.oldPrice == null)     this.oldPrice   = this.mrp;
  if (this.oldPrice != null && this.mrp == null)     this.mrp        = this.oldPrice;

  if (this.pricePerUnit != null && this.totalPrice == null) {
    this.totalPrice = this.pricePerUnit;
  }
  
  if (!this.packSize) {
    this.packSize = '1 Pack';
  }
  
  if (!this.quantityOptions || this.quantityOptions.length === 0) {
    this.quantityOptions = [1];
  }

  if (this.genericName && !this.genericFor) this.genericFor = this.genericName;
  if (this.genericFor && !this.genericName) this.genericName = this.genericFor;

  if (this.saltComposition && !this.activeIngredient) this.activeIngredient = this.saltComposition;
  if (this.activeIngredient && !this.saltComposition) this.saltComposition = this.activeIngredient;
});

medicineSchema.pre('save', function () {
  if (this.title)                this.name  = this.title;
  if (this.pricePerUnit != null) this.price = this.pricePerUnit;
  if (this.oldPrice != null)     this.mrp   = this.oldPrice;
});

medicineSchema.pre('findOneAndUpdate', async function () {
  const upd = this.getUpdate();
  if (!upd) return;

  if (upd.countryOrigin && typeof upd.countryOrigin === 'string') {
    const rawVal = upd.countryOrigin.trim();
    const upperVal = rawVal.toUpperCase();
    const resolved = LEGACY_COUNTRY_MAP[upperVal];
    upd.countryOrigin = {
      countryCode: resolved ? resolved.countryCode : null,
      countryName: resolved ? resolved.countryName : rawVal,
      dialCode: resolved ? resolved.dialCode : null,
    };
  }

  if (upd.name && !upd.title)                upd.title  = upd.name;
  if (upd.title && !upd.name)                upd.name   = upd.title;

  if (upd.price != null && upd.pricePerUnit == null) upd.pricePerUnit = upd.price;
  if (upd.pricePerUnit != null && upd.price == null) upd.price       = upd.pricePerUnit;

  if (upd.mrp != null && upd.oldPrice == null)     upd.oldPrice   = upd.mrp;
  if (upd.oldPrice != null && upd.mrp == null)     upd.mrp        = upd.oldPrice;
  
  if (upd.genericName && !upd.genericFor) upd.genericFor = upd.genericName;
  if (upd.genericFor && !upd.genericName) upd.genericName = upd.genericFor;

  if (upd.saltComposition && !upd.activeIngredient) upd.activeIngredient = upd.saltComposition;
  if (upd.activeIngredient && !upd.saltComposition) upd.saltComposition = upd.activeIngredient;
});

// ── Indexes for the hot storefront queries (filter + sort) ──────────────────
medicineSchema.index({ status: 1, createdAt: -1 });
medicineSchema.index({ category: 1, status: 1 });
medicineSchema.index({ brand: 1, status: 1 });
medicineSchema.index({ isBestSeller: 1, status: 1 });
medicineSchema.index({ isNewAndBest: 1, status: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);
