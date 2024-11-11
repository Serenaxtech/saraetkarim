const express = require('express');
const reviewController = require('../controllers/reviewController');
const { validateCreateReview, validateUpdateReview, validateId, validateCustomerId, validateProductId } = require('../validations/reviewValidator');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

router.get('/', authenticate, authorize(0), reviewController.getAllReviews);
router.get('/:id', authenticate, authorize(0, 1), validateId, reviewController.getReviewById);
router.get('/customer/:customerId', authenticate, authorize(0, 1), validateCustomerId, reviewController.getReviewsByCustomerId);
router.get('/product/:productId', authenticate, authorize(0, 1), validateProductId, reviewController.getReviewsByProductId);

router.post('/', authenticate, authorize(0, 1), validateCreateReview, reviewController.createReview);

router.put('/:id', authenticate, authorize(0, 1), validateUpdateReview, reviewController.updateReview);

router.delete('/:id', authenticate, authorize(0, 1), validateId, reviewController.deleteReview);

module.exports = router;
