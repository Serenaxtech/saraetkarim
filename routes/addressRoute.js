const express = require('express');
const addressController = require('../controllers/addressController');
const { validateAddress, validateAddressId, validateCustomerId } = require('../validations/addressValidator');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.get('/', authenticate, authorize(0), addressController.getAlladdresses);
router.get('/:id', authenticate, authorize(0, 1), validateAddressId, addressController.getaddressById);
router.get('/customer/:customerId', authenticate, authorize(0, 1), validateCustomerId, addressController.getaddressByCustId);

router.post('/', authenticate, authorize(0, 1), validateAddress, addressController.insertaddress);

router.put('/:id', authenticate, authorize(0, 1), [validateAddressId, validateAddress], addressController.updateaddress);

router.delete('/:id', authenticate, authorize(0, 1), validateAddressId, addressController.deleteaddress);

module.exports = router;
