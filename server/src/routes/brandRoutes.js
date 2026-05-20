const express = require('express');
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createBrandRules, updateBrandRules } = require('../validators/brandValidators');

router
  .route('/')
  .get(getBrands)
  .post(protect, authorize('admin', 'superadmin'), createBrandRules, validate, createBrand);

router
  .route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateBrandRules, validate, updateBrand)
  .delete(protect, authorize('admin', 'superadmin'), deleteBrand);

module.exports = router;
