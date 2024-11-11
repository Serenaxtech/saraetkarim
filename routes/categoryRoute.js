const express = require('express');
const categoryController = require('../controllers/categoryController');
const { validateCreateCategory, validateUpdateCategory, validateCategoryId } = require('../validations/categoryValidator');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.get('/', authenticate, authorize(0, 1), categoryController.getAllCategories);
router.get('/:id', authenticate, authorize(0, 1), validateCategoryId,  categoryController.getCategoryById);

router.post('/', authenticate, authorize(0), validateCreateCategory, categoryController.createCategory);

router.put('/:id', authenticate, authorize(0), validateUpdateCategory, categoryController.updateCategory);

router.delete('/:id', authenticate, authorize(0), validateCategoryId, categoryController.deleteCategory);

module.exports = router;
