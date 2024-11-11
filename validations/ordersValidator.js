const { body, param, validationResult } = require('express-validator');


const validateOrderData = [
    body('cart_ID')
        .isInt().withMessage('Cart ID must be an integer')
        .notEmpty().withMessage('Cart ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateOrderId = [
    param('id')
        .isInt().withMessage('Order ID must be an integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateOrderData,
    validateOrderId,
};
