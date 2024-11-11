const { initDB } = require('../database/connection');
const reviews = require('../Models/reviewModel');

/**
 * Service class for managing reviews.
 */
class ReviewService {
    constructor() {
        this.pool = null;
        this.init();
    }

    /**
     * Initialize the database connection pool.
     */
    async init() {
        this.pool = await initDB(); 
    }

    /**
     * Retrieve all reviews from the database.
     * @returns {Promise<Array>} An array of review objects.
     */
    async getAllReviews() {
        const [rows] = await this.pool.query('SELECT * FROM reviews');
        return rows.map(reviews.fromRow);
    }

    /**
     * Get a review by its ID.
     * @param {number} id - The review ID.
     * @returns {Promise<Object|null>} The review object or null if not found.
     */
    async getReviewById(id) {
        const [rows] = await this.pool.query('SELECT * FROM reviews WHERE review_ID = ?', [id]);
        if (rows.length === 0) return null;
        return reviews.fromRow(rows[0]);
    }

    /**
     * Get all reviews made by a specific customer.
     * @param {number} customerId - The customer's ID.
     * @returns {Promise<Array>} An array of review objects.
     */
    async getReviewsByCustomerId(customerId) {
        const [rows] = await this.pool.query('SELECT * FROM reviews WHERE customer_ID = ?', [customerId]);
        return rows.map(reviews.fromRow);
    }

    /**
     * Get all reviews for a specific product.
     * @param {number} productId - The product ID.
     * @returns {Promise<Array>} An array of review objects.
     */
    async getReviewsByProductId(productId) {
        const [rows] = await this.pool.query('SELECT * FROM reviews WHERE product_ID = ?', [productId]);
        return rows.map(reviews.fromRow);
    }

    /**
     * Add a new review.
     * @param {number} customer_ID - The customer's ID.
     * @param {Object} reviewData - The data for the new review.
     * @returns {Promise<Object>} The newly added review object.
     */
    async addReview(customer_ID, reviewData) {
        const { product_ID, rating, review_Text } = reviewData;

        const [result] = await this.pool.query(
            'INSERT INTO reviews (customer_ID, product_ID, rating, review_Text) VALUES (?, ?, ?, ?)',
            [customer_ID, product_ID, rating, review_Text]
        );

        const addedReview = new reviews(result.insertId, customer_ID, product_ID, rating, review_Text);
        return addedReview;
    }

    /**
     * Update an existing review.
     * @param {number} id - The review ID.
     * @param {number} customer_ID - The customer's ID.
     * @param {Object} reviewData - The updated review data.
     * @returns {Promise<boolean>} True if the update was successful, false otherwise.
     * @throws Will throw an error if the review is not found or access is denied.
     */
    async updateReview(id, customer_ID, reviewData) {
        const { product_ID, rating, review_Text } = reviewData;
    
        // Check if the review exists and belongs to the customer
        const [reviewRows] = await this.pool.query('SELECT customer_ID FROM reviews WHERE review_ID = ?', [id]);
        
        if (reviewRows.length === 0) {
            throw new Error('Review not found');
        }
    
        const reviewOwnerID = reviewRows[0].customer_ID;
        if (reviewOwnerID !== customer_ID) {
            throw new Error('Access denied: You are not allowed to update this review');
        }

        // Update the review in the database
        const [result] = await this.pool.query(
            'UPDATE reviews SET customer_ID = ?, product_ID = ?, rating = ?, review_Text = ? WHERE review_ID = ?',
            [customer_ID, product_ID, rating, review_Text, id]
        );
    
        return result.affectedRows > 0;
    }

    /**
     * Delete a review.
     * @param {number} id - The review ID.
     * @param {number} customer_ID - The customer's ID.
     * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
     */
    async deleteReview(id, customer_ID) {
        const [result] = await this.pool.query(
            'DELETE FROM reviews WHERE review_ID = ? AND customer_ID = ?',
            [id, customer_ID]
        );
        return result.affectedRows === 1;
    }
}

module.exports = new ReviewService();
