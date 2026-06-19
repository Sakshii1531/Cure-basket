const Prescription = require('../models/Prescription');
const Settings = require('../models/Settings');
const sendEmail = require('../utils/sendEmail');
const { uploadBuffer } = require('./uploadController');
const sanitizeError = require('../utils/sanitizeError');
const fs = require('fs');
const path = require('path');

// Helper: delete a Cloudinary asset by URL
async function deleteCloudinaryAsset(url) {
  try {
    if (!url || !url.includes('cloudinary.com')) return;
    // Dynamically import cloudinary only when needed
    const { v2: cloudinary } = require('cloudinary');
    // Extract public_id from the URL  (path between /upload/[version/] and the extension)
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (!match) return;
    const publicId = match[1];
    // Try both 'image' and 'raw' resource types (PDFs are stored as raw)
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch(() => {});
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw'  }).catch(() => {});
  } catch (_) {}
}

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
    ).populate('user', 'name email');

    if (!prescription) {
      return res.status(404).json({ success: false, error: 'Prescription not found' });
    }

    // Fire the configured dispense email when the new status matches the template.
    // Fire-and-forget: an email failure must not fail the status update.
    sendDispenseEmail(prescription).catch((err) =>
      console.error('Failed to send dispense email:', err.message)
    );

    res.status(200).json({ success: true, data: prescription });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// Sends the admin-configured "Dispense" email template to the patient, but only
// when the prescription's new status matches the template's configured status.
async function sendDispenseEmail(prescription) {
  const settings = await Settings.findOne({ type: 'dispense' });
  const tpl = settings && settings.data;
  if (!tpl || !tpl.status || !tpl.emailContent) return;

  // Only send when the template status matches the prescription's new status.
  if (String(tpl.status).toLowerCase() !== String(prescription.status).toLowerCase()) return;

  const toEmail = prescription.user && prescription.user.email;
  if (!toEmail) return;

  const tokens = {
    prescription_number: String(prescription._id),
    patient_name: (prescription.user && prescription.user.name) || 'Customer',
    status: prescription.status,
  };

  // Replace <token> placeholders case-insensitively (e.g. <Patient_name> or <patient_name>)
  const fill = (text) =>
    Object.entries(tokens).reduce(
      (out, [key, val]) => out.replace(new RegExp(`<${key}>`, 'gi'), val),
      String(text || '')
    );

  const subject = fill(tpl.emailSubject || 'Prescription Update');
  const html = fill(tpl.emailContent).replace(/\n/g, '<br>');

  await sendEmail({ to: toEmail, subject, html });
}

// @desc    Delete a prescription (admin)
// @route   DELETE /api/prescriptions/:id
// @access  Private/Admin
exports.deletePrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ success: false, error: 'Prescription not found' });
    }

    // Clean up the stored file
    if (prescription.image) {
      if (prescription.image.includes('cloudinary.com')) {
        deleteCloudinaryAsset(prescription.image); // fire-and-forget
      } else {
        // Local fallback storage
        const localPath = path.join(__dirname, '../../', prescription.image);
        if (fs.existsSync(localPath)) {
          try { fs.unlinkSync(localPath); } catch (_) {}
        }
      }
    }

    await prescription.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};
