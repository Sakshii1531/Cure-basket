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

router
  .route('/')
  .get(cache(3600), getCategories)
  .post(protect, authorize('admin'), createCategory);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
