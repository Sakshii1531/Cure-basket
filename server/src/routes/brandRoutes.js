const express = require('express');
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

router
  .route('/')
  .get(getBrands)
  .post(protect, authorize('admin', 'superadmin'), createBrand);

router
  .route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateBrand)
  .delete(protect, authorize('admin', 'superadmin'), deleteBrand);

module.exports = router;
