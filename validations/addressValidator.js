const { body, param, validationResult } = require('express-validator');

const validateAddress = [
  body('region')
    .isString()
    .withMessage('Region must be a string')
    .notEmpty()
    .withMessage('Region is required'),
  
  body('street')
    .isString()
    .withMessage('Street must be a string')
    .notEmpty()
    .withMessage('Street is required'),

  body('building')
    .isString()
    .withMessage('Building must be a string')
    .notEmpty()
    .withMessage('Building is required'),

  body('floor')
    .isInt({ min: 0 })
    .withMessage('Floor must be a positive integer')
    .notEmpty()
    .withMessage('Floor is required'),

  body('moreDetails')
    .optional()
    .isString()
    .withMessage('More details must be a string'),

  body('customer_ID')
    .isInt()
    .withMessage('Customer ID must be an integer')
    .notEmpty()
    .withMessage('Customer ID is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateAddressId = [
  param('id')
    .isInt()
    .withMessage('ID must be an integer'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateCustomerId = [
  param('customerId')
    .isInt().withMessage('Customer ID must be an integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateAddress,
  validateAddressId,
  validateCustomerId
};
