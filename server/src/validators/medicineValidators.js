const { body } = require('express-validator');

const coreRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Medicine name is required')
    .isLength({ max: 200 }).withMessage('Name must be at most 200 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('description')
    .optional()
    .isLength({ max: 2000 }).withMessage('Description must be at most 2000 characters'),
];

exports.createMedicineRules = coreRules;

exports.updateMedicineRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Name must be between 1 and 200 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('description')
    .optional()
    .isLength({ max: 2000 }).withMessage('Description must be at most 2000 characters'),
];
