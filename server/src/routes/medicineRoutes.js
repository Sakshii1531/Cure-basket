const express = require('express');
const {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  bulkUploadMedicines,
} = require('../controllers/medicineController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');
const { cache } = require('../middlewares/cacheMiddleware');
const validate = require('../middlewares/validate');
const { createMedicineRules, updateMedicineRules } = require('../validators/medicineValidators');
const { uploadExcel } = require('../middlewares/upload');

router
  .route('/')
  .get(cache(3600), getMedicines)
  .post(protect, authorize('admin', 'superadmin'), createMedicineRules, validate, createMedicine);

router
  .route('/bulk-upload')
  .post(protect, authorize('admin', 'superadmin'), uploadExcel.single('file'), bulkUploadMedicines);

router
  .route('/:id')
  .get(cache(3600), getMedicine)
  .put(protect, authorize('admin', 'superadmin'), updateMedicineRules, validate, updateMedicine)
  .delete(protect, authorize('admin', 'superadmin'), deleteMedicine);

module.exports = router;
