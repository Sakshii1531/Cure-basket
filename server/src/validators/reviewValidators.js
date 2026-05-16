const { body } = require('express-validator');

exports.createReviewRules = [
  body('medicine')
    .notEmpty().withMessage('Medicine ID is required')
    .isMongoId().withMessage('Invalid medicine ID'),

  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),

  body('comment')
    .optional()
    .isLength({ max: 1000 }).withMessage('Comment must be at most 1000 characters'),
];

exports.updateReviewStatusRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Status must be pending, approved, or rejected'),
];
