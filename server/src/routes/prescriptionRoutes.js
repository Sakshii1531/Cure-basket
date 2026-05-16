const express = require('express');
const {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptions,
  updatePrescriptionStatus
} = require('../controllers/prescriptionController');

const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router
  .route('/')
  .get(protect, authorize('admin', 'superadmin'), getPrescriptions)
  .post(protect, upload.single('prescription'), uploadPrescription);

router.get('/my-prescriptions', protect, getMyPrescriptions);

router.put('/:id/status', protect, authorize('admin', 'superadmin'), updatePrescriptionStatus);

module.exports = router;
