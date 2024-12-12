const { initDB } = require('../database/connection');
const Cart = require('../Models/cartModel');

/**
 * Service class for managing cart-related operations.
 */
class CartService {
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
     * Retrieve all cart items from the database.
     * @returns {Promise<Array>} An array of cart items.
     */
    async getAllCartItems() {
        const [rows] = await this.pool.query('SELECT * FROM cart');
        return rows.map(Cart.fromRow);
    }

    /**
     * Get a specific cart item by its ID.
     * @param {number} id - The cart item ID.
     * @returns {Promise<Object|null>} The cart item or null if not found.
     */
    async getCartItemById(id) {
        const [rows] = await this.pool.query('SELECT * FROM cart WHERE cart_ID = ?', [id]);
        if (rows.length === 0) return null;
        return Cart.fromRow(rows[0]);
    }

    /**
     * Get all cart items for a specific customer.
     * @param {number} customerId - The customer's ID.
     * @returns {Promise<Array>} An array of cart items.
     */
    async getCartItemsByCustomerId(customerId) {
        const [rows] = await this.pool.query('SELECT * FROM cart WHERE customer_ID = ?', [customerId]);
        return rows.map(Cart.fromRow);
    }

    /**
     * Add a new item to the cart.
     * @param {Object} cartData - The data for the cart item.
     * @param {number} customer_ID - The customer's ID.
     * @returns {Promise<Cart>} The newly added cart item.
     */
    async addToCart(cartData, customer_ID) {
        const { product_ID, quantity } = cartData;
        const [result] = await this.pool.query(
            'INSERT INTO cart (customer_ID, product_ID, quantity, status) VALUES (?, ?, ?, "active")',
            [customer_ID, product_ID, quantity]
        );

        return new Cart(result.insertId, customer_ID, product_ID, quantity, "active" );
    }

    
    /**
     * Fetch all active carts for a specific customer.
     * @param {number} customerID - The ID of the customer whose active carts are to be fetched.
     */
    async getActiveCartsByCustomerId(customerID) {
        const [rows] = await this.pool.query(
            'SELECT * FROM cart WHERE customer_ID = ? AND status = "active"',
            [customerID]
        );
        return rows;
    }
    

    /**
     * Update an existing cart item.
     * @param {number} id - The cart item ID.
     * @param {number} customerID - The customer's ID.
     * @param {Object} cartData - The updated data for the cart item.
     * @returns {Promise<boolean>} True if the update was successful, false otherwise.
     */
    async updateCartItem(id, customerID, cartData) {
        const { quantity } = cartData;
        const [result] = await this.pool.query(
            'UPDATE cart SET quantity = ? WHERE cart_ID = ? AND customer_ID = ?',
            [quantity, id, customerID]
        );
        return result.affectedRows > 0;
    }

    /**
     * Delete a cart item.
     * @param {number} id - The cart item ID.
     * @param {number} customerID - The customer's ID.
     * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
     */
    async deleteCartItem(id, customerID) {
        const [result] = await this.pool.query(
            'DELETE FROM cart WHERE cart_ID = ? AND customer_ID = ?',
            [id, customerID]
        );
        return result.affectedRows === 1;
    }

    /**
     * Calculate the total price of all items in the customer's cart.
     * @param {number} customerID - The customer's ID.
     * @returns {Promise<number>} The total price.
     */
    async calculateTotal(customerID) {
        try {
            const [rows] = await this.pool.query(`
                SELECT c.quantity, p.product_Price
                FROM cart AS c
                JOIN product AS p ON c.product_ID = p.product_ID
                WHERE c.customer_ID = ? AND c.status = "active"
            `, [customerID]);

            // Calculate the total price by summing up the price of each item times its quantity
            const total = rows.reduce((acc, item) => acc + (item.quantity * item.product_Price), 0);

            return total;
        } catch (error) {
            console.error("Error calculating total:", error);
            throw error;
        }
    }
}

module.exports = new CartService();
