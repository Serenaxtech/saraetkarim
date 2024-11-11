const { body, param, validationResult } = require('express-validator');

const validateCreateCategory = [
    body('category_Name')
        .isString().withMessage('Category name must be a string')
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 100 }).withMessage('Category name must be less than 100 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateUpdateCategory = [
    param('id')
        .isInt().withMessage('Category ID must be an integer'),

    body('category_Name')
        .optional()
        .isString().withMessage('Category name must be a string')
        .isLength({ max: 100 }).withMessage('Category name must be less than 100 characters'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateCategoryId = [
    param('id')
        .isInt().withMessage('Category ID must be an integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateCreateCategory,
    validateUpdateCategory,
    validateCategoryId,
};
