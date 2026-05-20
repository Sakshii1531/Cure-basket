const Brand = require('../models/Brand');
const sanitizeError = require('../utils/sanitizeError');

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 500, 500);
    const skip = (page - 1) * limit;

    const [brands, total] = await Promise.all([
      Brand.find().sort('name').skip(skip).limit(limit),
      Brand.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: brands.length,
      total,
      pagination: { page, limit, pages: Math.ceil(total / limit) },
      data: brands,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Create new brand
// @route   POST /api/brands
// @access  Private/Admin
exports.createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ success: true, data: brand });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
exports.updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    res.status(200).json({ success: true, data: brand });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    await brand.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};
