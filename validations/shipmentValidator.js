const { body, param, validationResult } = require('express-validator');


const validateShipmentData = [
    body('order_ID')
        .isInt().withMessage('Order ID must be an integer')
        .notEmpty().withMessage('Order ID is required'),

    body('customer_ID')
        .isInt().withMessage('Customer ID must be an integer')
        .notEmpty().withMessage('Customer ID is required'),


    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateShipmentId = [
    param('id')
        .isInt().withMessage('Shipment ID must be an integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateShipmentData,
    validateShipmentId,
};
