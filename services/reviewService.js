const { initDB } = require('../database/connection');
const reviews = require('../Models/reviewModel');

class ReviewService{

    constructor(){
        this.pool = null;
        this.init();
    }

    async init() {
        this.pool = await initDB(); 
    }

    async getAllReviews(){
        const [rows] = await this.pool.query('SELECT * FROM reviews');
        return rows.map(reviews.fromRow);
    }

    async getReviewById(id) {
        const [rows] = await this.pool.query('SELECT * FROM reviews WHERE review_ID = ?', [id]);
        if (rows.length == 0) return null;
        return reviews.fromRow(rows[0]);
    }

    async getReviewsByCustomerId(customerId) {
        const [rows] = await this.pool.query('SELECT * FROM reviews WHERE customer_ID = ?', [customerId]);
        return rows.map(reviews.fromRow);
    }

    async getReviewsByProductId(customerId) {
        const [rows] = await this.pool.query('SELECT * FROM reviews WHERE product_ID = ?', [customerId]);
        return rows.map(reviews.fromRow);
    }

    async addReview(customer_ID, reviewData) {
        const { product_ID, rating, review_Text } = reviewData;

        const [result] = await this.pool.query(
            'INSERT INTO reviews (customer_ID, product_ID, rating, review_Text) VALUES (?, ?, ?, ?)',
            [customer_ID, product_ID, rating, review_Text]
        );

        const addedReview = new reviews(result.insertId, customer_ID, product_ID, rating, review_Text);
        return addedReview;
    }

    async updateReview(id, customer_ID, reviewData) {
        const { product_ID, rating, review_Text } = reviewData;
    
        const [reviewRows] = await this.pool.query('SELECT customer_ID FROM reviews WHERE review_ID = ?', [id]);
        
        if (reviewRows.length === 0) {
            throw new Error('Review not found');
        }
    

        const reviewOwnerID = reviewRows[0].customer_ID;
        if (reviewOwnerID !== customer_ID) {
            throw new Error('Access denied: You are not allowed to update this review');
        }

        const [result] = await this.pool.query(
            'UPDATE reviews SET customer_ID = ?, product_ID = ?, rating = ?, review_Text = ? WHERE review_ID = ?',
            [customer_ID, product_ID, rating, review_Text, id]
        );
    
        return result.affectedRows > 0;
    }
    

    async deleteReview(id, customer_ID) {
        const [result] = await this.pool.query('DELETE FROM reviews WHERE review_ID = ? AND customer_ID = ?', [id, customer_ID]);
        return result.affectedRows === 1;
    }
}

module.exports = new ReviewService();
