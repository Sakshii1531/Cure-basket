const Category = require('../models/Category');
const { clearCache } = require('../middlewares/cacheMiddleware');
const sanitizeError = require('../utils/sanitizeError');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 500, 500);
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      Category.find().sort('name').skip(skip).limit(limit),
      Category.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: categories.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: categories,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    await clearCache('/api/categories');
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    await clearCache('/api/categories');
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    await category.deleteOne();

    await clearCache('/api/categories');
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: sanitizeError(err) });
  }
};
