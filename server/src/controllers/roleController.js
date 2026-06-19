const Role = require('../models/Role');
const User = require('../models/User');
const sanitizeError = require('../utils/sanitizeError');

exports.getRoles = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);
    const skip = (page - 1) * limit;

    const [roles, total] = await Promise.all([
      Role.find().sort('name').skip(skip).limit(limit),
      Role.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: roles.length,
      total,
      pagination: { page, limit, pages: Math.ceil(total / limit) },
      data: roles,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, error: 'Email/User ID is already in use by another user' });
      }
    }

    const role = await Role.create(req.body);

    if (email && password) {
      await User.create({
        name,
        email,
        password,
        role: 'admin',
        customRole: role._id,
      });
    }

    res.status(201).json({ success: true, data: role });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name, permissions, email, password } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ success: false, error: 'Role not found' });

    if (email && email.toLowerCase() !== role.email?.toLowerCase()) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists.customRole?.toString() !== role._id.toString()) {
        return res.status(400).json({ success: false, error: 'Email/User ID is already in use by another user' });
      }
    }

    const oldEmail = role.email;

    // Update Role
    if (name !== undefined) role.name = name;
    if (permissions !== undefined) role.permissions = permissions;
    if (email !== undefined) role.email = email;
    if (password !== undefined) role.password = password;

    await role.save();

    // Synchronize User
    if (role.email) {
      let user = await User.findOne({ customRole: role._id });
      if (!user && oldEmail) {
        user = await User.findOne({ email: oldEmail });
      }

      const userFields = {
        name: role.name,
        email: role.email,
        role: 'admin',
        customRole: role._id,
      };
      if (password) {
        userFields.password = password;
      }

      if (user) {
        Object.assign(user, userFields);
        await user.save();
      } else {
        if (!password) {
          return res.status(400).json({ success: false, error: 'Password is required to configure login credentials' });
        }
        await User.create(userFields);
      }
    } else if (oldEmail) {
      // If email was removed, delete the associated User
      await User.deleteOne({ customRole: role._id });
    }

    res.status(200).json({ success: true, data: role });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ success: false, error: 'Role not found' });

    // Delete the associated user completely
    await User.deleteMany({ customRole: role._id });
    await role.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: sanitizeError(err) });
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
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};
