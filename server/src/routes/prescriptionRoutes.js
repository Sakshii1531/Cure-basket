const express = require('express');
const {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptions,
  updatePrescriptionStatus,
  deletePrescription,
} = require('../controllers/prescriptionController');

const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router
  .route('/')
  .get(protect, authorize('admin', 'superadmin'), getPrescriptions)
  .post(protect, upload.single('prescription'), uploadPrescription);

router.get('/my-prescriptions', protect, getMyPrescriptions);

router
  .route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updatePrescriptionStatus)
  .delete(protect, authorize('admin', 'superadmin'), deletePrescription);

// Keep backward-compat alias for older clients using PUT /:id/status
router.put('/:id/status', protect, authorize('admin', 'superadmin'), updatePrescriptionStatus);

module.exports = router;
