const { body } = require('express-validator');

exports.createOrderRules = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least one item'),

  body('items.*.medicine')
    .notEmpty().withMessage('Each item must reference a medicine')
    .isMongoId().withMessage('Invalid medicine ID'),

  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),

  body('totalAmount')
    .notEmpty().withMessage('Total amount is required')
    .isFloat({ min: 0 }).withMessage('Total amount must be a non-negative number'),

  body('shippingAddress')
    .notEmpty().withMessage('Shipping address is required'),
];

exports.updateOrderStatusRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'])
    .withMessage('Invalid order status'),
];
