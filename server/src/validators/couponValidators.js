const { body } = require('express-validator');

exports.createCouponRules = [
  body('code')
    .trim()
    .notEmpty().withMessage('Coupon code is required')
    .isLength({ max: 30 }).withMessage('Code must be at most 30 characters')
    .matches(/^[A-Z0-9_-]+$/i).withMessage('Code may only contain letters, numbers, hyphens, and underscores'),

  body('discountType')
    .notEmpty().withMessage('Discount type is required')
    .isIn(['percent', 'flat']).withMessage('Discount type must be "percent" or "flat"'),

  body('value')
    .notEmpty().withMessage('Discount value is required')
    .isFloat({ min: 0 }).withMessage('Value must be a non-negative number'),

  body('minOrder')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum order must be a non-negative number'),

  body('maxDiscount')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Max discount must be a non-negative number'),

  body('usageLimit')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('Usage limit must be a positive integer'),

  body('expiresAt')
    .optional({ nullable: true })
    .isISO8601().withMessage('Expiry must be a valid ISO 8601 date'),
];

exports.updateCouponRules = [
  body('code')
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Code must be at most 30 characters')
    .matches(/^[A-Z0-9_-]+$/i).withMessage('Code may only contain letters, numbers, hyphens, and underscores'),

  body('discountType')
    .optional()
    .isIn(['percent', 'flat']).withMessage('Discount type must be "percent" or "flat"'),

  body('value')
    .optional()
    .isFloat({ min: 0 }).withMessage('Value must be a non-negative number'),

  body('minOrder')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum order must be a non-negative number'),

  body('maxDiscount')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('Max discount must be a non-negative number'),

  body('usageLimit')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('Usage limit must be a positive integer'),

  body('expiresAt')
    .optional({ nullable: true })
    .isISO8601().withMessage('Expiry must be a valid ISO 8601 date'),
];
