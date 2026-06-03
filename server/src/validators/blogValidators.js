const { body } = require('express-validator');

exports.createBlogRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Blog title is required')
    .isLength({ max: 200 }).withMessage('Title must be at most 200 characters'),

  body('sections')
    .isArray({ min: 1 }).withMessage('At least one section is required'),

  body('sections.*.title')
    .trim()
    .notEmpty().withMessage('Section title is required'),

  body('sections.*.content')
    .trim()
    .notEmpty().withMessage('Section content is required'),

  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/).withMessage('Slug may only contain lowercase letters, numbers, and hyphens'),
];

exports.updateBlogRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),

  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/).withMessage('Slug may only contain lowercase letters, numbers, and hyphens'),
];
