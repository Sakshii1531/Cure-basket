const express = require('express');
const {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine
} = require('../controllers/medicineController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');
const { cache } = require('../middlewares/cacheMiddleware');

router
  .route('/')
  .get(cache(3600), getMedicines)
  .post(protect, authorize('admin'), createMedicine);

router
  .route('/:id')
  .get(cache(3600), getMedicine)
  .put(protect, authorize('admin'), updateMedicine)
  .delete(protect, authorize('admin'), deleteMedicine);

module.exports = router;
