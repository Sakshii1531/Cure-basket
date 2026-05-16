const User = require('../models/User');
const sanitizeError = require('../utils/sanitizeError');

exports.getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').populate('customRole', 'name').sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('customRole', 'name permissions');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Prevent escalation: only superadmin may promote to superadmin
    if (req.body.role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, error: 'Only superadmin can assign superadmin role' });
    }

    const ALLOWED = ['name', 'phone', 'address', 'role', 'customRole', 'isActive'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => ALLOWED.includes(k)));

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password').populate('customRole', 'name');

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    if (user.role === 'superadmin') {
      return res.status(403).json({ success: false, error: 'Cannot delete superadmin account' });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};
