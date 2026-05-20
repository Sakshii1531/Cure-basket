const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');
const { cache } = require('../middlewares/cacheMiddleware');
const validate = require('../middlewares/validate');
const { createCategoryRules, updateCategoryRules } = require('../validators/categoryValidators');

router
  .route('/')
  .get(cache(3600), getCategories)
  .post(protect, authorize('admin', 'superadmin'), createCategoryRules, validate, createCategory);

router
  .route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateCategoryRules, validate, updateCategory)
  .delete(protect, authorize('admin', 'superadmin'), deleteCategory);

module.exports = router;
