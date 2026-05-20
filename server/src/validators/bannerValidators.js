const { body } = require('express-validator');

exports.createBannerRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Banner title is required')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),

  body('image')
    .trim()
    .notEmpty().withMessage('Banner image URL is required'),

  body('position')
    .optional()
    .isIn(['main', 'promo', 'category', 'popup']).withMessage('Position must be one of: main, promo, category, popup'),

  body('link')
    .optional()
    .trim(),

  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

exports.updateBannerRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),

  body('image')
    .optional()
    .trim()
    .notEmpty().withMessage('Image URL cannot be empty'),

  body('position')
    .optional()
    .isIn(['main', 'promo', 'category', 'popup']).withMessage('Position must be one of: main, promo, category, popup'),

  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];
