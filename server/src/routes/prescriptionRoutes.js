const express = require('express');
const {
  uploadPrescription,
  getMyPrescriptions,
  getPrescriptions,
  updatePrescriptionStatus
} = require('../controllers/prescriptionController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/authMiddleware');

router
  .route('/')
  .get(protect, authorize('admin'), getPrescriptions)
  .post(protect, uploadPrescription);

router.get('/my-prescriptions', protect, getMyPrescriptions);

router.put('/:id/status', protect, authorize('admin'), updatePrescriptionStatus);

module.exports = router;
