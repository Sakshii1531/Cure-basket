const express = require('express');
const router = express.Router();
const { getReviews, getMedicineReviews, createReview, updateReviewStatus, deleteReview } = require('../controllers/reviewController');
const { protect, authorize, can } = require('../middlewares/authMiddleware');

// Public: get approved reviews for a medicine
router.get('/medicine/:medicineId', getMedicineReviews);

// Admin: list all reviews (filterable by status/medicine)
router.get('/', protect, authorize('admin', 'superadmin'), can('reviews', 'read'), getReviews);

// Public (logged-in user): submit a review
router.post('/', protect, createReview);

// Admin: moderate review status
router.put('/:id/status', protect, authorize('admin', 'superadmin'), can('reviews', 'write'), updateReviewStatus);

// Admin: delete review
router.delete('/:id', protect, authorize('admin', 'superadmin'), can('reviews', 'delete'), deleteReview);

module.exports = router;
