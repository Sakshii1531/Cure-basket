const { body } = require('express-validator');

const MODULES = ['medicines', 'orders', 'users', 'categories', 'brands', 'blogs', 'banners', 'reviews', 'coupons', 'prescriptions', 'settings', 'analytics', 'roles', 'chat'];
const ACTIONS = ['read', 'write', 'delete'];

exports.createRoleRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Role name is required')
    .isLength({ max: 100 }).withMessage('Role name must be at most 100 characters'),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array'),

  body('permissions.*.module')
    .optional()
    .isIn(MODULES).withMessage(`Module must be one of: ${MODULES.join(', ')}`),

  body('permissions.*.actions')
    .optional()
    .isArray().withMessage('Actions must be an array'),

  body('permissions.*.actions.*')
    .optional()
    .isIn(ACTIONS).withMessage(`Action must be one of: ${ACTIONS.join(', ')}`),
];

exports.updateRoleRules = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Role name cannot be empty')
    .isLength({ max: 100 }).withMessage('Role name must be at most 100 characters'),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please provide a valid email'),

  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  body('permissions')
    .optional()
    .isArray().withMessage('Permissions must be an array'),

  body('permissions.*.module')
    .optional()
    .isIn(MODULES).withMessage(`Module must be one of: ${MODULES.join(', ')}`),

  body('permissions.*.actions')
    .optional()
    .isArray().withMessage('Actions must be an array'),

  body('permissions.*.actions.*')
    .optional()
    .isIn(ACTIONS).withMessage(`Action must be one of: ${ACTIONS.join(', ')}`),
];
