const { body } = require('express-validator');

exports.createCategoryRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ max: 80 }).withMessage('Name must be at most 80 characters'),
];

exports.updateCategoryRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 80 }).withMessage('Name must be between 1 and 80 characters'),
];
