const reviewService = require('../services/reviewService');

class ReviewController {

    async getAllReviews(req, res) {
        try {
            const reviews = await reviewService.getAllReviews();
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getReviewById(req, res) {
        try {
            const { id } = req.params;
            const review = await reviewService.getReviewById(id);
            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.status(200).json(review);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getReviewsByCustomerId(req, res) {
        try {
            const { customerId } = req.params;
            const reviews = await reviewService.getReviewsByCustomerId(customerId);
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getReviewsByProductId(req, res) {
        try {
            const { productId } = req.params;
            const reviews = await reviewService.getReviewsByProductId(productId);
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createReview(req, res) {
        try {
            const customer_ID = req.user.id;
            const reviewData = req.body;
            const newReview = await reviewService.addReview(customer_ID, reviewData);
            res.status(201).json(newReview);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateReview(req, res) {
        try {
            const customer_ID = req.user.id;
            const { id } = req.params;
            const reviewData = req.body;
            const isUpdated = await reviewService.updateReview(id, customer_ID, reviewData);
            if (!isUpdated) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.status(200).json({ message: 'Review updated successfully' });
        } catch (error) {

            if (error.message === 'Access denied: You are not allowed to update this review') {
                return res.status(403).json({ message: 'Access denied' });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteReview(req, res) {
        try {
            const customer_ID = req.user.id;
            const { id } = req.params;
            const isDeleted = await reviewService.deleteReview(id, customer_ID);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.status(200).json({ message: 'Review deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ReviewController();
