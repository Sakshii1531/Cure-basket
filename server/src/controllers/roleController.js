const Role = require('../models/Role');
const User = require('../models/User');

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort('name');
    res.status(200).json({ success: true, count: roles.length, data: roles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!role) return res.status(404).json({ success: false, error: 'Role not found' });
    res.status(200).json({ success: true, data: role });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ success: false, error: 'Role not found' });

    // Unassign this role from any users before deleting
    await User.updateMany({ customRole: role._id }, { customRole: null, role: 'user' });
    await role.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Assign a custom role to an admin user
exports.assignRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ success: false, error: 'Role not found' });

    const user = await User.findByIdAndUpdate(
      userId,
      { customRole: roleId, role: 'admin' },
      { new: true }
    ).populate('customRole');

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
