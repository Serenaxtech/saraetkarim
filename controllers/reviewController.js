const reviewService = require('../services/reviewService');

/**
 * Controller class for managing reviews.
 */
class ReviewController {
    /**
     * Get all reviews.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllReviews(req, res) {
        try {
            // Fetch all reviews from the service
            const reviews = await reviewService.getAllReviews();
            res.json(reviews);
        } catch (error) {
            console.error('Error fetching all reviews:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get a specific review by its ID.
     * @param {Object} req - Express request object containing the review ID.
     * @param {Object} res - Express response object.
     */
    async getReviewById(req, res) {
        try {
            const { id } = req.params;
            // Fetch the review with the specified ID
            const review = await reviewService.getReviewById(id);
            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.status(200).json(review);
        } catch (error) {
            console.error('Error fetching review by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all reviews by a specific customer.
     * @param {Object} req - Express request object containing the customer ID.
     * @param {Object} res - Express response object.
     */
    async getReviewsByCustomerId(req, res) {
        try {
            const { customerId } = req.params;
            // Fetch reviews for the specified customer ID
            const reviews = await reviewService.getReviewsByCustomerId(customerId);
            res.status(200).json(reviews);
        } catch (error) {
            console.error('Error fetching reviews by customer ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all reviews for a specific product.
     * @param {Object} req - Express request object containing the product ID.
     * @param {Object} res - Express response object.
     */
    async getReviewsByProductId(req, res) {
        try {
            const { productId } = req.params;
            // Fetch reviews for the specified product ID
            const reviews = await reviewService.getReviewsByProductId(productId);
            res.status(200).json(reviews);
        } catch (error) {
            console.error('Error fetching reviews by product ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create a new review.
     * @param {Object} req - Express request object containing review data.
     * @param {Object} res - Express response object.
     */
    async createReview(req, res) {
        try {
            const customer_ID = req.user.id;
            const reviewData = req.body;
            // Add a new review using the service
            const newReview = await reviewService.addReview(customer_ID, reviewData);
            res.status(201).json(newReview);
        } catch (error) {
            console.error('Error creating review:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update an existing review.
     * @param {Object} req - Express request object containing review data and ID.
     * @param {Object} res - Express response object.
     */
    async updateReview(req, res) {
        try {
            const customer_ID = req.user.id;
            const { id } = req.params;
            const reviewData = req.body;
            // Update the review with the specified ID
            const isUpdated = await reviewService.updateReview(id, customer_ID, reviewData);
            if (!isUpdated) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.status(200).json({ message: 'Review updated successfully' });
        } catch (error) {
            if (error.message === 'Access denied: You are not allowed to update this review') {
                return res.status(403).json({ message: 'Access denied' });
            }
            console.error('Error updating review:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete a review by its ID.
     * @param {Object} req - Express request object containing the review ID.
     * @param {Object} res - Express response object.
     */
    async deleteReview(req, res) {
        try {
            const customer_ID = req.user.id;
            const { id } = req.params;
            // Delete the review with the specified ID
            const isDeleted = await reviewService.deleteReview(id, customer_ID);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.status(200).json({ message: 'Review deleted successfully' });
        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ReviewController();
