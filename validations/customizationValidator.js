const { body, param, validationResult } = require('express-validator');

const validateCustomizationData = [
    body('size')
        .isInt({ min: 1 }).withMessage('Size must be a positive integer')
        .notEmpty().withMessage('Size is required'),

    body('color')
        .isString().withMessage('Color must be a string')
        .notEmpty().withMessage('Color is required'),

    body('product_ID')
        .isInt().withMessage('Product ID must be an integer')
        .notEmpty().withMessage('Product ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateCustomizationId = [
    param('id')
        .isInt().withMessage('Customization ID must be an integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateCustomizationData,
    validateCustomizationId,
};
