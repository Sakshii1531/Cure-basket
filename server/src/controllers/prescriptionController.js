const Prescription = require('../models/Prescription');
const { uploadBuffer } = require('./uploadController');
const sanitizeError = require('../utils/sanitizeError');
const fs = require('fs');
const path = require('path');

// @desc    Upload prescription
// @route   POST /api/prescriptions
// @access  Private
exports.uploadPrescription = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a prescription image or PDF' });
    }

    // Upload to Cloudinary so prescriptions never depend on the local disk
    // (survives redeploys and works across multiple app instances). PDFs are
    // uploaded as 'raw' so Cloudinary delivers them without the PDF/ZIP image-
    // delivery restriction that otherwise returns 401. Falls back to local
    // storage only if Cloudinary is unreachable.
    const isPdf = req.file.originalname.toLowerCase().endsWith('.pdf') || req.file.mimetype === 'application/pdf';
    let image;

    try {
      const result = await uploadBuffer(
        req.file.buffer,
        'cure-basket/prescriptions',
        isPdf ? { resource_type: 'raw' } : {}
      );
      image = result.secure_url;
    } catch (cloudinaryError) {
      console.warn('Cloudinary prescription upload failed, falling back to local storage:', cloudinaryError.message);

      const uploadDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = isPdf ? '.pdf' : (path.extname(req.file.originalname) || '.png');
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
      image = `/uploads/${filename}`;
    }

    let { notes, medicine, packageLabel, quantity } = req.body;

    // Sanitize stringified values from FormData
    if (medicine === 'undefined' || medicine === 'null' || !medicine) {
      medicine = null;
    }
    if (packageLabel === 'undefined' || packageLabel === 'null') {
      packageLabel = undefined;
    }
    if (quantity === 'undefined' || quantity === 'null') {
      quantity = undefined;
    }

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
        .populate('order', '_id status totalAmount createdAt')
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
