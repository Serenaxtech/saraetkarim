const { body, param, validationResult } = require('express-validator');

const validateCartData = [
    body('quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
        .notEmpty().withMessage('Quantity is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateCartId = [
    param('id')
        .isInt().withMessage('Cart ID must be an integer'),

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
    validateCartData,
    validateCartId,
    validateCustomerId,
};
