const { body, param, validationResult } = require('express-validator');

const validateCreateReview = [
  body('product_ID')
    .isInt().withMessage('Product ID must be an integer')
    .notEmpty().withMessage('Product ID is required'),

  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5')
    .notEmpty().withMessage('Rating is required'),

  body('review_Text')
    .isString().withMessage('Review text must be a string')
    .isLength({ min: 10, max: 500 }).withMessage('Review text must be between 10 and 500 characters'),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validateUpdateReview = [
  param('id')
    .isInt().withMessage('Review ID must be an integer'),

  body('product_ID')
    .optional()
    .isInt().withMessage('Product ID must be an integer'),

  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),

  body('review_Text')
    .optional()
    .isString().withMessage('Review text must be a string')
    .isLength({ min: 10, max: 500 }).withMessage('Review text must be between 10 and 500 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validateId = [
  param('id')
    .isInt().withMessage('ID must be an integer'),
  
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
    .isInt().withMessage('ID must be an integer'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validateProductId = [
  param('productId')
    .isInt().withMessage('ID must be an integer'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateCreateReview,
  validateUpdateReview,
  validateId,
  validateCustomerId,
  validateProductId
};
