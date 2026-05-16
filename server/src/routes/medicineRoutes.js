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
const validate = require('../middlewares/validate');
const { createMedicineRules, updateMedicineRules } = require('../validators/medicineValidators');

router
  .route('/')
  .get(cache(3600), getMedicines)
  .post(protect, authorize('admin', 'superadmin'), createMedicineRules, validate, createMedicine);

router
  .route('/:id')
  .get(cache(3600), getMedicine)
  .put(protect, authorize('admin', 'superadmin'), updateMedicineRules, validate, updateMedicine)
  .delete(protect, authorize('admin', 'superadmin'), deleteMedicine);

module.exports = router;
