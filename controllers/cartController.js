const cartService = require('../services/cartService');

class CartController {

    async getAllCartItems(req, res) {
        try {
            const cartItems = await cartService.getAllCartItems();
            res.json(cartItems);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCartItemById(req, res) {
        try {
            const { id } = req.params;
            const cartItem = await cartService.getCartItemById(id);
            if (!cartItem) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            res.json(cartItem);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCartItemsByCustomerId(req, res) {
        try {
            const customerId = req.user.id;
            const cartItems = await cartService.getCartItemsByCustomerId(customerId);
            res.json(cartItems);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async addToCart(req, res) {
        try {
            const customerId = req.user.id;
            const cartData = req.body;
            const newCartItem = await cartService.addToCart(cartData, customerId);
            res.status(201).json(newCartItem);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCartItem(req, res) {
        try {
            const customerID = req.user.id;
            const { id }  = req.params;
            const cartData = req.body;
            const isUpdated = await cartService.updateCartItem(id, customerID, cartData);
            if (!isUpdated) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            res.json({ message: 'Cart item updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    async calculateTotal(req, res) {
        try {
            const customerID = req.user.id;
    
            const total = await cartService.calculateTotal(customerID);
    
            res.status(200).json({ total });
        } catch (error) {
            console.error("Error calculating total in controller:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    

    async deleteCartItem(req, res) {
        try {
            const customerID = req.user.id;
            const { id } = req.params;
            const isDeleted = await cartService.deleteCartItem(id, customerID);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            res.json({ message: 'Cart item deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new CartController();
