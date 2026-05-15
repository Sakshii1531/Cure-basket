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
  .post(protect, authorize('admin'), createBrand);

router
  .route('/:id')
  .put(protect, authorize('admin'), updateBrand)
  .delete(protect, authorize('admin'), deleteBrand);

module.exports = router;
