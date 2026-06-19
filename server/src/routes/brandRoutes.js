const express = require('express');
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');

const router = express.Router();

const { protect, authorize, can } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createBrandRules, updateBrandRules } = require('../validators/brandValidators');

router
  .route('/')
  .get(getBrands)
  .post(protect, authorize('admin', 'superadmin'), can('brands', 'write'), createBrandRules, validate, createBrand);

router
  .route('/:id')
  .put(protect, authorize('admin', 'superadmin'), can('brands', 'write'), updateBrandRules, validate, updateBrand)
  .delete(protect, authorize('admin', 'superadmin'), can('brands', 'delete'), deleteBrand);

module.exports = router;
