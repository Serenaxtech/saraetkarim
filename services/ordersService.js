const { initDB } = require('../database/connection');
const Orders = require('../Models/ordersModel');

/**
 * Service class for managing orders.
 */
class OrdersService {
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
     * Retrieve all orders from the database.
     * @returns {Promise<Array>} An array of order objects.
     */
    async getAllOrders() {
        const [rows] = await this.pool.query('SELECT * FROM orders');
        return rows.map(Orders.fromRow);
    }

    /**
     * Get an order by its ID, ensuring the requesting customer has access.
     * @param {number} orderId - The ID of the order to retrieve.
     * @param {number} customerID - The ID of the customer making the request.
     * @returns {Promise<Object>} The order object.
     * @throws Will throw an error if the order is not found or access is denied.
     */
    async getOrderById(orderId, customerID) {
        try {
            // Fetch the order and associated customer ID from the database
            const [rows] = await this.pool.query(`
                SELECT o.*, c.customer_ID
                FROM orders AS o
                JOIN cart AS c ON o.cart_ID = c.cart_ID
                WHERE o.order_ID = ?
            `, [orderId]);

            if (rows.length === 0) {
                throw new Error('Order not found');
            }

            const order = rows[0];

            // Check if the requesting customer owns the order
            if (order.customer_ID !== customerID) {
                throw new Error('Access denied: You are not allowed to view this order');
            }

            return Orders.fromRow(order);
        } catch (error) {
            
            throw error;
        }
    }

    /**
     * Create a new order for a given cart, ensuring the customer owns the cart.
     * @param {number} cartId - The ID of the cart.
     * @param {number} customerID - The ID of the customer making the request.
     * @returns {Promise<Object>} The newly created order object.
     * @throws Will throw an error if the cart is not found or access is denied.
     */
    async createOrder(cartId, customerID) {
        try {
            // Verify that the cart exists and belongs to the customer
            const [cartRows] = await this.pool.query(
                'SELECT customer_ID, status FROM cart WHERE cart_ID = ?',
                [cartId]
            );
    
            if (cartRows.length === 0) {
                throw new Error('Cart not found');
            }
    
            const { customer_ID: cartOwnerID, status } = cartRows[0];
            if (cartOwnerID !== customerID) {
                throw new Error('Access denied: You are not allowed to create an order for this cart');
            }
            if (status !== 'active') {
                throw new Error('Cart has already been checked out');
            }
    
            const [result] = await this.pool.query(
                'INSERT INTO orders (cart_ID) VALUES (?)',
                [cartId]
            );
    

            await this.pool.query(
                'UPDATE cart SET status = "checked_out" WHERE cart_ID = ?',
                [cartId]
            );
    
            return new Orders(result.insertId, cartId);
        } catch (error) {
            throw error;
        }
    }

    
    /**
     * Delete an order by its ID, ensuring the requesting customer has access.
     * @param {number} id - The ID of the order to delete.
     * @param {number} customerID - The ID of the customer making the request.
     * @returns {Promise<boolean>} True if the order was deleted, false otherwise.
     * @throws Will throw an error if the order is not found or access is denied.
     */
    async deleteOrder(id, customerID) {
        try {
            // Verify that the order exists and belongs to the customer
            const [orderRows] = await this.pool.query(
                'SELECT c.customer_ID FROM orders AS o JOIN cart AS c ON o.cart_ID = c.cart_ID WHERE o.order_ID = ?',
                [id]
            );

            if (orderRows.length === 0) {
                throw new Error('Order not found');
            }

            const orderOwnerID = orderRows[0].customer_ID;
            if (orderOwnerID !== customerID) {
                throw new Error('Access denied: You are not allowed to delete this order');
            }

            // Delete the order from the database
            const [result] = await this.pool.query('DELETE FROM orders WHERE order_ID = ?', [id]);
            return result.affectedRows === 1;
        } catch (error) {
            
            throw error;
        }
    }
}

module.exports = new OrdersService();
