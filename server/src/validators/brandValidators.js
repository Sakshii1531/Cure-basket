const { body } = require('express-validator');

exports.createBrandRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Brand name is required')
    .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
];

exports.updateBrandRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
];
