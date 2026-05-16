const Prescription = require('../models/Prescription');
const { uploadBuffer } = require('./uploadController');

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
    res.status(400).json({ success: false, error: err.message });
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
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private/Admin
exports.getPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find().populate('user', 'name email').populate('medicine', 'name image');
    res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
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
    res.status(400).json({ success: false, error: err.message });
  }
};
