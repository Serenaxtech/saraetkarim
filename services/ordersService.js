const { initDB } = require('../database/connection');
const Orders = require('../Models/ordersModel');

class OrdersService {
    constructor() {
        this.pool = null;
        this.init();
    }

    async init() {
        this.pool = await initDB();
    }

    async getAllOrders() {
        const [rows] = await this.pool.query('SELECT * FROM orders');
        return rows.map(Orders.fromRow);
    }

    async getOrderById(orderId, customerID) {
        try {
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
            
            if (order.customer_ID !== customerID) {
                throw new Error('Access denied: You are not allowed to view this order');
            }
    
            return Orders.fromRow(order);
        } catch (error) {
            // console.error("Error in getOrderById:", error);
            throw error;
        }
    }
    

    async createOrder(cartId, customerID) {
        try {
            const [cartRows] = await this.pool.query(
                'SELECT customer_ID FROM cart WHERE cart_ID = ?',
                [cartId]
            );
    
            if (cartRows.length === 0) {
                throw new Error('Cart not found');
            }
            const cartOwnerID = cartRows[0].customer_ID;
            if (cartOwnerID !== customerID) {
                throw new Error('Access denied: You are not allowed to create an order for this cart');
            }
    
            const [result] = await this.pool.query(
                'INSERT INTO orders (cart_ID) VALUES (?)',
                [cartId]
            );
    
            return new Orders(result.insertId, cartId);
        } catch (error) {
            // console.error("Error in createOrder:", error);
            throw error;
        }
    }

    
    async deleteOrder(id, customerID) {
        try {
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
    
            const [result] = await this.pool.query('DELETE FROM orders WHERE order_ID = ?', [id]);
            return result.affectedRows === 1;
        } catch (error) {
            // console.error("Error in deleteOrder:", error); 
            throw error;
        }
    }
    
}

module.exports = new OrdersService();
