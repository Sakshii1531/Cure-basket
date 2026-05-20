const Prescription = require('../models/Prescription');
const { uploadBuffer } = require('./uploadController');
const sanitizeError = require('../utils/sanitizeError');

// @desc    Upload prescription
// @route   POST /api/prescriptions
// @access  Private
exports.uploadPrescription = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a prescription image or PDF' });
    }

    const result = await uploadBuffer(req.file.buffer, 'cure-basket/prescriptions');
    const image = result.secure_url;
    const { notes, medicine, packageLabel, quantity } = req.body;

    const prescription = await Prescription.create({
      user: req.user.id,
      medicine,
      packageLabel,
      quantity,
      image,
      notes
    });

    res.status(201).json({ success: true, data: prescription });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Get user prescriptions
// @route   GET /api/prescriptions/my-prescriptions
// @access  Private
exports.getMyPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user.id });
    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private/Admin
exports.getPrescriptions = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [prescriptions, total] = await Promise.all([
      Prescription.find(filter)
        .populate('user', 'name email')
        .populate('medicine', 'name image')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit),
      Prescription.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: prescriptions.length,
      total,
      pagination: { page, limit, pages: Math.ceil(total / limit) },
      data: prescriptions,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Update prescription status
// @route   PUT /api/prescriptions/:id/status
// @access  Private/Admin
exports.updatePrescriptionStatus = async (req, res, next) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, notes: req.body.notes },
      { new: true, runValidators: true }
    );

    if (!prescription) {
      return res.status(404).json({ success: false, error: 'Prescription not found' });
    }

    res.status(200).json({ success: true, data: prescription });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};
