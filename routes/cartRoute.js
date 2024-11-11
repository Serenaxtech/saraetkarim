const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { validateCartData, validateCartId, validateCustomerId } = require('../validations/cartValidator');

router.get('/', authenticate, authorize(0), cartController.getAllCartItems);
router.get('/total', authenticate, authorize(0, 1), cartController.calculateTotal);
router.get('/:id', authenticate, authorize(0, 1), validateCartId, cartController.getCartItemById);
router.get('/customer/:customerId', authenticate, authorize(0, 1), validateCustomerId, cartController.getCartItemsByCustomerId);


router.post('/', authenticate, authorize(0, 1), validateCartData, cartController.addToCart);

router.put('/:id', authenticate, authorize(0, 1), validateCartId, validateCartData, cartController.updateCartItem);

router.delete('/:id', authenticate, authorize(0, 1), validateCartId, cartController.deleteCartItem);

module.exports = router;
