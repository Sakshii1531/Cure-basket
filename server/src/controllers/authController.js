const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sanitizeError = require('../utils/sanitizeError');
const sendEmail = require('../utils/sendEmail');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true on Render (HTTPS)
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' on production (cross-site), 'lax' on development
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).cookie('cb_token', token, COOKIE_OPTIONS).json({
    success: true,
    token,
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

    // Send welcome email — fire-and-forget, never block registration
    sendEmail({
      to: user.email,
      subject: 'Welcome to CureBasket!',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
          <div style="background:#006D6D;padding:32px 24px;text-align:center;border-radius:8px 8px 0 0;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:-0.5px;">CureBasket</h1>
            <p style="color:#b2dfdf;margin:6px 0 0;font-size:13px;">Your trusted online pharmacy</p>
          </div>
          <div style="padding:32px 24px;">
            <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 12px;">Welcome, ${user.name}! 👋</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 20px;">
              Thank you for joining CureBasket. Your account has been created successfully.
              We're here to make getting your medicines easy, fast, and reliable.
            </p>
            <div style="background:#f0fafa;border-left:4px solid #006D6D;padding:16px 20px;border-radius:4px;margin-bottom:24px;">
              <p style="margin:0;color:#006D6D;font-size:13px;font-weight:600;">What you can do now:</p>
              <ul style="margin:8px 0 0;padding-left:16px;color:#555;font-size:13px;line-height:1.8;">
                <li>Browse our wide range of medicines</li>
                <li>Upload prescriptions for prescription-only medicines</li>
                <li>Track your orders in real time</li>
              </ul>
            </div>
            <a href="${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}" style="display:inline-block;background:#006D6D;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">
              Start Shopping
            </a>
          </div>
          <div style="border-top:1px solid #f0f0f0;padding:16px 24px;text-align:center;">
            <p style="color:#aaa;font-size:11px;margin:0;">
              You received this email because you registered at CureBasket.
            </p>
          </div>
        </div>
      `,
    }).catch((emailErr) => console.error('[welcome-email] failed:', emailErr.message));

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil').populate('customRole');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Account locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        error: `Account locked. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.`,
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      const attempts = (user.loginAttempts || 0) + 1;
      const update = { loginAttempts: attempts };
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        update.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        update.loginAttempts = 0;
      }
      await User.findByIdAndUpdate(user._id, update);

      const remaining = MAX_LOGIN_ATTEMPTS - attempts;
      const msg = attempts >= MAX_LOGIN_ATTEMPTS
        ? 'Too many failed attempts. Account locked for 15 minutes.'
        : `Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`;

      return res.status(401).json({ success: false, error: msg });
    }

    // Successful login — reset lockout counters
    if (user.loginAttempts > 0 || user.lockUntil) {
      await User.findByIdAndUpdate(user._id, { loginAttempts: 0, lockUntil: null });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // Don't reveal whether email exists — always return 200
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    const resetUrl = `${frontendOrigin}/reset-password/${resetToken}`;

    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your CureBasket account.</p>
      <p>Click the link below to reset your password. This link expires in <strong>10 minutes</strong>.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#006D6D;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({ to: user.email, subject: 'CureBasket — Password Reset', html });

    res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    // Clear token fields if email send fails so user can retry
    await User.findOneAndUpdate(
      { email: req.body.email },
      { resetPasswordToken: undefined, resetPasswordExpire: undefined }
    );
    res.status(500).json({ success: false, error: 'Email could not be sent. Please try again.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token.' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
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
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Add a new shipping address
// @route   POST /api/auth/me/addresses
// @access  Private
exports.addAddress = async (req, res) => {
  try {
    const { name, street, city, phone } = req.body;
    if (!name || !street || !city || !phone) {
      return res.status(400).json({ success: false, error: 'All address fields are required' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $push: { addresses: { name, street, city, phone } } },
      { new: true, runValidators: true }
    );
    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Update an existing shipping address
// @route   PUT /api/auth/me/addresses/:addressId
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const { name, street, city, phone } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, 'addresses._id': req.params.addressId },
      {
        $set: {
          'addresses.$.name':   name,
          'addresses.$.street': street,
          'addresses.$.city':   city,
          'addresses.$.phone':  phone,
        },
      },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, error: 'Address not found' });
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Delete a shipping address
// @route   DELETE /api/auth/me/addresses/:addressId
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { addresses: { _id: req.params.addressId } } },
      { new: true }
    );
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};
