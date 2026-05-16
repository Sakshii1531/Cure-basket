const User = require('../models/User');
const jwt = require('jsonwebtoken');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).cookie('cb_token', token, COOKIE_OPTIONS).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      customRole: user.customRole,
    },
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await User.create({ name, email, password, phone, address });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password').populate('customRole');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.logout = (req, res) => {
  res.cookie('cb_token', '', { ...COOKIE_OPTIONS, maxAge: 0 })
    .status(200)
    .json({ success: true, message: 'Logged out' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('customRole');
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
