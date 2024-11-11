const express = require('express');
const router = express.Router();
const customizationController = require('../controllers/customizationController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { validateCustomizationData, validateCustomizationId } = require('../validations/customizationValidator');

router.get('/', authenticate, authorize(0, 1), customizationController.getAllCustomizations);
router.get('/:id', authenticate, authorize(0, 1), validateCustomizationId, customizationController.getCustomizationById);

router.post('/', authenticate, authorize(0), validateCustomizationData, customizationController.createCustomization);

router.put('/:id', authenticate, authorize(0), validateCustomizationId, customizationController.updateCustomization);

router.delete('/:id', authenticate, authorize(0), validateCustomizationId, customizationController.deleteCustomization);

module.exports = router;
