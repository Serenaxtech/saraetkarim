const { body, param, validationResult } = require('express-validator');


const validateCreateProduct = [
    body('product_Name')
        .isString().withMessage('Product name must be a string')
        .notEmpty().withMessage('Product name is required')
        .isLength({ max: 100 }).withMessage('Product name must be less than 100 characters'),

    body('product_IMG')
        .optional()
        .isString().withMessage('Product image URL must be a string'),

    body('product_Description')
        .isString().withMessage('Product description must be a string')
        .notEmpty().withMessage('Product description is required')
        .isLength({ max: 500 }).withMessage('Product description must be less than 500 characters'),

    body('product_Info')
        .isString().withMessage('Product info must be a string')
        .notEmpty().withMessage('Product info is required')
        .isLength({ max: 1000 }).withMessage('Product info must be less than 1000 characters'),

    body('product_Price')
        .isFloat({ gt: 0 }).withMessage('Product price must be a positive number')
        .notEmpty().withMessage('Product price is required'),

    body('category_ID')
        .isInt().withMessage('Category ID must be an integer')
        .notEmpty().withMessage('Category ID is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateUpdateProduct = [
    param('id')
        .isInt().withMessage('Product ID must be an integer'),

    body('product_Name')
        .optional()
        .isString().withMessage('Product name must be a string')
        .isLength({ max: 100 }).withMessage('Product name must be less than 100 characters'),

    body('product_IMG')
        .optional()
        .isString().withMessage('Product image URL must be a string'),

    body('product_Description')
        .optional()
        .isString().withMessage('Product description must be a string')
        .isLength({ max: 500 }).withMessage('Product description must be less than 500 characters'),

    body('product_Info')
        .optional()
        .isString().withMessage('Product info must be a string')
        .isLength({ max: 1000 }).withMessage('Product info must be less than 1000 characters'),

    body('product_Price')
        .optional()
        .isFloat({ gt: 0 }).withMessage('Product price must be a positive number'),

    body('category_ID')
        .optional()
        .isInt().withMessage('Category ID must be an integer'),

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

const validateCategoryId = [
    param('categoryId')
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
    validateCreateProduct,
    validateUpdateProduct,
    validateId,
    validateCategoryId
};
