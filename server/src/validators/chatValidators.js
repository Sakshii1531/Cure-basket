const { body } = require('express-validator');

exports.startConversationRules = [
  body('sessionId')
    .trim()
    .notEmpty().withMessage('Session ID is required')
    .isLength({ max: 100 }).withMessage('Invalid session ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Subject must be at most 200 characters'),
];

exports.postMessageRules = [
  body('text')
    .trim()
    .notEmpty().withMessage('Message cannot be empty')
    .isLength({ max: 2000 }).withMessage('Message must be at most 2000 characters'),
];

exports.statusRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['waiting_human', 'human_active', 'resolved', 'async'])
    .withMessage('Invalid conversation status'),
];
