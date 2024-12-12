const express = require('express');
const customerController = require('../controllers/customerController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { validateCreateCustomer, validateCustomerSigIn, validateUpdateCustomer, validateCustomerId, validateCustomerChangePassword } = require('../validations/customerValidator');

const router = express.Router();

// Only Authorized For Admin
router.get('/', authenticate, authorize(0), customerController.getAllCustomers);

router.get('/:id', authenticate, authorize(0, 1), validateCustomerId, customerController.getCustomerById);

router.post('/', validateCreateCustomer, customerController.createCustomer);

router.post('/admin', validateCreateCustomer, customerController.createAdmin);
router.post('/sigin', validateCustomerSigIn, customerController.signIn);

router.put('/:id/change/password', authenticate, authorize(0, 1), [validateCustomerId, validateCustomerChangePassword], customerController.changeCustomerPassword);
router.put('/:id?', authenticate, authorize(0, 1), [validateCustomerId, validateUpdateCustomer], customerController.updateCustomer);

router.delete('/:id', authenticate, authorize(0, 1), validateCustomerId, customerController.deleteCustomer);


module.exports = router;
