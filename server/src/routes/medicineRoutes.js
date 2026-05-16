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
  .post(protect, authorize('admin', 'superadmin'), createMedicine);

router
  .route('/:id')
  .get(cache(3600), getMedicine)
  .put(protect, authorize('admin', 'superadmin'), updateMedicine)
  .delete(protect, authorize('admin', 'superadmin'), deleteMedicine);

module.exports = router;
