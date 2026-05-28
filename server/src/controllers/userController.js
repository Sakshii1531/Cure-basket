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
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Prevent escalation: only superadmin may promote to superadmin
    if (req.body.role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, error: 'Only superadmin can assign superadmin role' });
    }

    const ALLOWED = ['name', 'email', 'phone', 'address', 'role', 'customRole', 'password'];
    
    ALLOWED.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    
    const updatedUser = await User.findById(user._id).select('-password').populate('customRole', 'name');
    res.status(200).json({ success: true, data: updatedUser });
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

exports.createUser = async (req, res) => {
  try {
    // Only superadmin can create a superadmin
    if (req.body.role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, error: 'Only superadmin can create superadmin accounts' });
    }

    const { name, email, password, phone, role, customRole, address } = req.body;

    // Check if user email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      customRole: customRole || null,
      address
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, data: userObj });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};
