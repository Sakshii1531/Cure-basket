const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false,
  },
  phone: {
    type: String,
  },
  // 'user' = customer, 'admin' = staff with a custom Role, 'superadmin' = full access
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user',
  },
  // Only set for role === 'admin' — references the Role document
  customRole: {
    type: mongoose.Schema.ObjectId,
    ref: 'Role',
    default: null,
  },
  address: { type: String }, // legacy single-address field kept for compatibility
  addresses: [
    {
      name:   { type: String, required: true },
      street: { type: String, required: true },
      city:   { type: String, required: true },
      phone:  { type: String, required: true },
    },
  ],
  // Account lockout
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  // Password reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  resetPasswordOTP: String,
  resetPasswordOTPExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

userSchema.methods.getResetPasswordOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetPasswordOTP = crypto.createHash('sha256').update(otp).digest('hex');
  this.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

// Returns true if the user can perform `action` on `module`
userSchema.methods.can = function (module, action) {
  if (this.role === 'superadmin') return true;
  if (this.role !== 'admin' || !this.customRole) return false;

  const perm = this.customRole.permissions?.find((p) => p.module === module);
  return perm ? perm.actions.includes(action) : false;
};

// ── Indexes ─────────────────────────────────────────────────────────────────
// email already has a unique index. Add role for admin user-list filters and
// analytics (counts of role: 'user', new signups this month).
userSchema.index({ role: 1, createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
