const express = require('express');
const {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  bulkUploadMedicines,
  validateStock,
  getPopularSearches,
} = require('../controllers/medicineController');

const router = express.Router();

const { protect, authorize, can } = require('../middlewares/authMiddleware');
const { cache } = require('../middlewares/cacheMiddleware');
const validate = require('../middlewares/validate');
const { createMedicineRules, updateMedicineRules } = require('../validators/medicineValidators');
const { uploadExcel } = require('../middlewares/upload');

router
  .route('/')
  .get(cache(3600), getMedicines)
  .post(protect, authorize('admin', 'superadmin'), can('medicines', 'write'), createMedicineRules, validate, createMedicine);

router
  .route('/bulk-upload')
  .post(protect, authorize('admin', 'superadmin'), can('medicines', 'write'), uploadExcel.single('file'), bulkUploadMedicines);

router.get('/popular-searches', getPopularSearches);

router
  .route('/validate-stock')
  .post(validateStock);

router
  .route('/:id')
  .get(cache(3600), getMedicine)
  .put(protect, authorize('admin', 'superadmin'), can('medicines', 'write'), updateMedicineRules, validate, updateMedicine)
  .delete(protect, authorize('admin', 'superadmin'), can('medicines', 'delete'), deleteMedicine);

module.exports = router;
