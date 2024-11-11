const express = require('express');
const productController = require('../controllers/productController');
const { validateCreateProduct, validateUpdateProduct, validateId, validateCategoryId } = require('../validations/productValidator');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.get('/', authenticate, authorize(0, 1), productController.getAllProducts);
router.get('/:id', authenticate, authorize(0, 1), validateId, productController.getProductById);
router.get('/category/:categoryId', authenticate, authorize(0, 1), validateCategoryId, productController.getProductByCategoryId);

router.post('/', authenticate, authorize(0), validateCreateProduct, productController.createProduct);

router.put('/:id', authenticate, authorize(0), validateUpdateProduct, productController.updateProduct);

router.delete('/:id', authenticate, authorize(0), validateId, productController.deleteProduct);

module.exports = router;
