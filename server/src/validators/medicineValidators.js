const { body } = require('express-validator');

const coreRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Medicine title is required')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),

  body('packSize')
    .trim()
    .notEmpty().withMessage('Pack size is required (e.g. 10 Tablets, 500mg Strip)'),

  body('quantityOptions')
    .notEmpty().withMessage('Quantity options are required')
    .isArray({ min: 1 }).withMessage('Quantity options must be an array with at least one entry')
    .custom((arr) => arr.every((n) => typeof n === 'number' && n > 0))
    .withMessage('Each quantity option must be a positive number'),

  body('pricePerUnit')
    .notEmpty().withMessage('Price per unit is required')
    .isFloat({ min: 0 }).withMessage('Price per unit must be a non-negative number'),

  body('totalPrice')
    .notEmpty().withMessage('Total price is required')
    .isFloat({ min: 0 }).withMessage('Total price must be a non-negative number'),

  body('oldPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Old price must be a non-negative number'),

  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),

  body('sku')
    .optional()
    .isInt({ min: 0 }).withMessage('SKU must be a non-negative integer'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be at most 2000 characters'),

  body('genericFor')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Generic for must be at most 200 characters'),

  body('activeIngredient')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Active ingredient must be at most 500 characters'),

  body('manufacturer')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Manufacturer must be at most 200 characters'),

  body('countryOrigin')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Country of origin must be at most 100 characters'),
];

exports.createMedicineRules = coreRules;

exports.updateMedicineRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),

  body('packSize')
    .optional()
    .trim()
    .notEmpty().withMessage('Pack size cannot be empty'),

  body('quantityOptions')
    .optional()
    .isArray({ min: 1 }).withMessage('Quantity options must be a non-empty array')
    .custom((arr) => arr.every((n) => typeof n === 'number' && n > 0))
    .withMessage('Each quantity option must be a positive number'),

  body('pricePerUnit')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price per unit must be a non-negative number'),

  body('totalPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Total price must be a non-negative number'),

  body('oldPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Old price must be a non-negative number'),

  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),

  body('sku')
    .optional()
    .isInt({ min: 0 }).withMessage('SKU must be a non-negative integer'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be at most 2000 characters'),

  body('genericFor')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Generic for must be at most 200 characters'),

  body('activeIngredient')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Active ingredient must be at most 500 characters'),

  body('manufacturer')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Manufacturer must be at most 200 characters'),

  body('countryOrigin')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Country of origin must be at most 100 characters'),
];
