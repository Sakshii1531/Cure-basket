const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');
const { clearCache } = require('../middlewares/cacheMiddleware');
const sanitizeError = require('../utils/sanitizeError');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Public
exports.getMedicines = async (req, res, next) => {
  try {
    let query;

    // Explicit allowlist of fields that may be used as filters — prevents MongoDB operator injection
    const ALLOWED_FILTERS = ['status', 'category', 'brand', 'isBestSeller', 'isNewAndBest', 'prescription'];
    const filter = {};
    for (const key of ALLOWED_FILTERS) {
      if (req.query[key] !== undefined) filter[key] = req.query[key];
    }

    // Finding resource
    query = Medicine.find(filter).populate('category brand');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Medicine.countDocuments(filter);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const medicines = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: medicines.length,
      pagination,
      data: medicines
    });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Public
exports.getMedicine = async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, error: 'Medicine not found' });
  }
  try {
    const medicine = await Medicine.findById(req.params.id).populate('category brand');

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    res.status(200).json({ success: true, data: medicine });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Create new medicine
// @route   POST /api/medicines
// @access  Private/Admin
exports.createMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.create(req.body);
    await clearCache('/api/medicines');
    res.status(201).json({ success: true, data: medicine });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
exports.updateMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    await clearCache('/api/medicines');
    res.status(200).json({ success: true, data: medicine });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
exports.deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    await medicine.deleteOne();

    await clearCache('/api/medicines');
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};
