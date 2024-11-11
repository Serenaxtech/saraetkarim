const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { validateOrderData, validateOrderId } = require('../validations/ordersValidator');


router.get('/', authenticate, authorize(0), ordersController.getAllOrders);
router.get('/:id', authenticate, authorize(0, 1), validateOrderId, ordersController.getOrderById);

router.post('/', authenticate, authorize(0, 1), validateOrderData, ordersController.createOrder);

router.delete('/:id', authenticate, authorize(0,1), validateOrderId, ordersController.deleteOrder);

module.exports = router;
