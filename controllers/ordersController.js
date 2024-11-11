const ordersService = require('../services/ordersService');

/**
 * Controller class for managing orders.
 */
class OrdersController {
    /**
     * Get all orders.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllOrders(req, res) {
        try {
            // Fetch all orders from the service
            const orders = await ordersService.getAllOrders();
            res.json(orders);
        } catch (error) {
            console.error('Error fetching all orders:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get a specific order by its ID.
     * @param {Object} req - Express request object containing user info and order ID.
     * @param {Object} res - Express response object.
     */
    async getOrderById(req, res) {
        try {
            const customerID = req.user.id;
            const { id } = req.params;

            // Fetch the order for the given ID and customer ID
            const order = await ordersService.getOrderById(id, customerID);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(order);
        } catch (error) {
            if (error.message === 'Access denied: You are not allowed to view this order') {
                return res.status(403).json({ message: 'Access denied' });
            }
            console.error('Error fetching order by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create a new order.
     * @param {Object} req - Express request object containing cart ID.
     * @param {Object} res - Express response object.
     */
    async createOrder(req, res) {
        try {
            const customerID = req.user.id;
            const { cart_ID } = req.body;

            // Create a new order using the cart ID and customer ID
            const newOrder = await ordersService.createOrder(cart_ID, customerID);
            res.status(201).json(newOrder);
        } catch (error) {
            if (error.message === 'Access denied: You are not allowed to create an order for this cart') {
                return res.status(403).json({ message: 'Access denied' });
            }
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete an order by its ID.
     * @param {Object} req - Express request object containing user info and order ID.
     * @param {Object} res - Express response object.
     */
    async deleteOrder(req, res) {
        try {
            const customerID = req.user.id;
            const { id } = req.params;

            // Delete the order for the given ID and customer ID
            const isDeleted = await ordersService.deleteOrder(id, customerID);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json({ message: 'Order deleted successfully' });
        } catch (error) {
            if (error.message === 'Access denied: You are not allowed to delete this order') {
                return res.status(403).json({ message: 'Access denied' });
            }
            console.error('Error deleting order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new OrdersController();
