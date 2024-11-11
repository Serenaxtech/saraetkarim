const { initDB } = require('../database/connection');
const Cart = require('../Models/cartModel');

class CartService {
    constructor() {
        this.pool = null;
        this.init();
    }

    async init() {
        this.pool = await initDB();
    }

    async getAllCartItems() {
        const [rows] = await this.pool.query('SELECT * FROM cart');
        return rows.map(Cart.fromRow);
    }

    async getCartItemById(id) {
        const [rows] = await this.pool.query('SELECT * FROM cart WHERE cart_ID = ?', [id]);
        if (rows.length === 0) return null;
        return Cart.fromRow(rows[0]);
    }

    async getCartItemsByCustomerId(customerId) {
        const [rows] = await this.pool.query('SELECT * FROM cart WHERE customer_ID = ?', [customerId]);
        return rows.map(Cart.fromRow);
    }

    async addToCart(cartData, customer_ID ) {
        const {product_ID, quantity } = cartData;
        const [result] = await this.pool.query(
            'INSERT INTO cart (customer_ID, product_ID, quantity) VALUES (?, ?, ?)',
            [customer_ID, product_ID, quantity]
        );
        return new Cart(result.insertId, customer_ID, product_ID, quantity);
    }

    async updateCartItem(id, customerID, cartData) {
        const { quantity } = cartData;
        const [result] = await this.pool.query(
            'UPDATE cart SET quantity = ? WHERE cart_ID = ? AND customer_ID = ?',
            [quantity, id, customerID]
        );
        return result.affectedRows > 0;
    }

    async deleteCartItem(id, customerID) {
        const [result] = await this.pool.query('DELETE FROM cart WHERE cart_ID = ? AND customer_ID = ?', [id, customerID]);
        return result.affectedRows === 1;
    }

    async calculateTotal(customerID) {
        try {
            const [rows] = await this.pool.query(`
                SELECT c.quantity, p.product_Price
                FROM cart AS c
                JOIN product AS p ON c.product_ID = p.product_ID
                WHERE c.customer_ID = ?
            `, [customerID]);

            const total = rows.reduce((acc, item) => acc + (item.quantity * item.product_Price), 0);

            return total;
        } catch (error) {
            console.error("Error calculating total:", error);
            throw error;
        }
    }

}

module.exports = new CartService();
