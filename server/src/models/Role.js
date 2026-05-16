const mongoose = require('mongoose');

const MODULES = [
  'medicines', 'categories', 'brands', 'orders', 'prescriptions',
  'users', 'blogs', 'reviews', 'coupons', 'banners',
  'analytics', 'settings', 'roles',
];

const ACTIONS = ['read', 'write', 'delete'];

const permissionSchema = new mongoose.Schema({
  module: { type: String, enum: MODULES, required: true },
  actions: [{ type: String, enum: ACTIONS }],
}, { _id: false });

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a role name'],
    unique: true,
    trim: true,
  },
  permissions: [permissionSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Role', roleSchema);
module.exports.MODULES = MODULES;
module.exports.ACTIONS = ACTIONS;
