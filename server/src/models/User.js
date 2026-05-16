const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    minlength: 6,
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
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
  address: {
    type: String,
  },
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

// Returns true if the user can perform `action` on `module`
userSchema.methods.can = function (module, action) {
  if (this.role === 'superadmin') return true;
  if (this.role !== 'admin' || !this.customRole) return false;

  const perm = this.customRole.permissions?.find((p) => p.module === module);
  return perm ? perm.actions.includes(action) : false;
};

module.exports = mongoose.model('User', userSchema);
