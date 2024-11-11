const ordersService = require('../services/ordersService');

class OrdersController {

    async getAllOrders(req, res) {
        try {
            const orders = await ordersService.getAllOrders();
            res.json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getOrderById(req, res) {
        try {
            const customerID = req.user.id;
            const { id } = req.params;
            const order = await ordersService.getOrderById(id, customerID);
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(order);
        } catch (error) {

            if (error.message === 'Access denied: You are not allowed to view this order') {
                return res.status(403).json({ message: 'Access denied' });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createOrder(req, res) {
        try {
            const customerID = req.user.id;
            const { cart_ID } = req.body;
            const newOrder = await ordersService.createOrder(cart_ID, customerID);
            res.status(201).json(newOrder);
        } catch (error) {

            if (error.message === 'Access denied: You are not allowed to create an order for this cart') {
                return res.status(403).json({ message: 'Access denied' });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteOrder(req, res) {
        try {
            const customerID = req.user.id;
            const { id } = req.params;
            const isDeleted = await ordersService.deleteOrder(id, customerID);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json({ message: 'Order deleted successfully' });
        } catch (error) {

            if (error.message === 'Access denied: You are not allowed to delete this order') {
                return res.status(403).json({ message: 'Access denied' });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new OrdersController();
