const cartService = require('../services/cartService');

/**
 * Controller class for managing cart-related operations.
 */
class CartController {
    /**
     * Get all items in the cart.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllCartItems(req, res) {
        try {
            // Fetch all cart items from the service
            const cartItems = await cartService.getAllCartItems();
            res.json(cartItems);
        } catch (error) {
            console.error('Error fetching all cart items:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get a specific cart item by its ID.
     * @param {Object} req - Express request object containing the cart item ID.
     * @param {Object} res - Express response object.
     */
    async getCartItemById(req, res) {
        try {
            const { id } = req.params;
            // Fetch the cart item using its ID
            const cartItem = await cartService.getCartItemById(id);
            if (!cartItem) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            res.json(cartItem);
        } catch (error) {
            console.error('Error fetching cart item by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get all cart items for a specific customer.
     * @param {Object} req - Express request object containing user information.
     * @param {Object} res - Express response object.
     */
    async getCartItemsByCustomerId(req, res) {
        try {
            const customerId = req.user.id;
            // Fetch cart items for the logged-in customer
            const cartItems = await cartService.getCartItemsByCustomerId(customerId);
            res.json(cartItems);
        } catch (error) {
            console.error('Error fetching cart items by customer ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Add a new item to the cart.
     * @param {Object} req - Express request object containing cart data.
     * @param {Object} res - Express response object.
     */
    async addToCart(req, res) {
        try {
            const customerId = req.user.id;
            const cartData = req.body;
            // Add the new item to the cart
            const newCartItem = await cartService.addToCart(cartData, customerId);
            res.status(201).json(newCartItem);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update an existing cart item.
     * @param {Object} req - Express request object containing cart data and item ID.
     * @param {Object} res - Express response object.
     */
    async updateCartItem(req, res) {
        try {
            const customerID = req.user.id;
            const { id } = req.params;
            const cartData = req.body;
            // Update the cart item with the provided data
            const isUpdated = await cartService.updateCartItem(id, customerID, cartData);
            if (!isUpdated) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            res.json({ message: 'Cart item updated successfully' });
        } catch (error) {
            console.error('Error updating cart item:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Calculate the total price of all items in the cart for the logged-in customer.
     * @param {Object} req - Express request object containing user information.
     * @param {Object} res - Express response object.
     */
    async calculateTotal(req, res) {
        try {
            const customerID = req.user.id;
            // Calculate the total price
            const total = await cartService.calculateTotal(customerID);
            res.status(200).json({ total });
        } catch (error) {
            console.error('Error calculating total:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete a cart item by its ID.
     * @param {Object} req - Express request object containing the cart item ID.
     * @param {Object} res - Express response object.
     */
    async deleteCartItem(req, res) {
        try {
            const customerID = req.user.id;
            const { id } = req.params;
            // Delete the specified cart item
            const isDeleted = await cartService.deleteCartItem(id, customerID);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            res.json({ message: 'Cart item deleted successfully' });
        } catch (error) {
            console.error('Error deleting cart item:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new CartController();
