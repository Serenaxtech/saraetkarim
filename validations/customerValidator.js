// validators/userValidator.js
const { body, param, validationResult } = require('express-validator');
const customerService = require('../services/customerService');

const validateCreateCustomer = [
  body('name')
    .isString().withMessage('Name must be a string')
    .notEmpty().withMessage('Name is required'),

  body('email')
    .isEmail().withMessage('Email must be in a valid format (e.g., example@domain.com)')
    .notEmpty().withMessage('Email is required')
    .custom(async (email) => {
      const exists = await customerService.emailExists(email);
      if (exists) {
        throw new Error('Email already exists');
      }
      return true;
    }),

  body('number')
    .isString().withMessage('Phone number must be a string')
    .matches(/^[0-9]{8}$/).withMessage('Phone number must be 8 digits')
    .notEmpty().withMessage('Phone number is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateCustomerSigIn = [
  body('email')
    .isEmail().withMessage('Email must be in a valid format (e.g., example@domain.com)')
    .notEmpty().withMessage('Email is required'),

    body('password')
    .isString().withMessage('Password must be a string')
    .notEmpty().withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validateUpdateCustomer = [
  body('name')
    .isString().withMessage('Name must be a string')
    .notEmpty().withMessage('Name is required'),

  body('email')
    .isEmail().withMessage('Email must be in a valid format (e.g., example@domain.com)')
    .notEmpty().withMessage('Email is required')
    .custom(async (email, { req }) => {
      const userId = req.user.id;

      const emailExists = await customerService.emailExistsForAnotherUser(email, userId);
      if (emailExists) {
        throw new Error('Email is already in use by another account');
      }
    }),

  body('number')
    .isString().withMessage('Phone number must be a string')
    .matches(/^[0-9]{8}$/).withMessage('Phone number must be 8 digits')
    .notEmpty().withMessage('Phone number is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateCustomerPassword = [
  body('password')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/\d/).withMessage('Password must contain a number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validateCustomerChangePassword = [
  body('old_password')
    .isString().withMessage('Old password must be a string')
    .notEmpty().withMessage('Old password is required'),

  body('new_password')
    .isString().withMessage('New password must be a string')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('New password must contain an uppercase letter')
    .matches(/\d/).withMessage('New password must contain a number')
    .custom((new_password, { req }) => {
      if (new_password === req.body.old_password) {
        throw new Error('New password cannot be the same as the old password');
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateCustomerId = [
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

module.exports = {
  validateCreateCustomer,
  validateCustomerSigIn,
  validateUpdateCustomer,
  validateCustomerId,
  validateCustomerChangePassword
};