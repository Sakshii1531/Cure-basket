const express = require('express');
const router = express.Router();
const { getReviews, getMedicineReviews, createReview, updateReviewStatus, deleteReview } = require('../controllers/reviewController');
const { protect, authorize, can } = require('../middlewares/authMiddleware');
const { cache } = require('../middlewares/cacheMiddleware');
const validate = require('../middlewares/validate');
const { createReviewRules, updateReviewStatusRules } = require('../validators/reviewValidators');

// Public: get approved reviews for a medicine
router.get('/medicine/:medicineId', cache(300), getMedicineReviews);

// Admin: list all reviews (filterable by status/medicine)
router.get('/', protect, authorize('admin', 'superadmin'), can('reviews', 'read'), getReviews);

// Public (logged-in user): submit a review
router.post('/', protect, createReviewRules, validate, createReview);

// Admin: moderate review status
router.put('/:id/status', protect, authorize('admin', 'superadmin'), can('reviews', 'write'), updateReviewStatusRules, validate, updateReviewStatus);

// Admin: delete review
router.delete('/:id', protect, authorize('admin', 'superadmin'), can('reviews', 'delete'), deleteReview);

module.exports = router;
