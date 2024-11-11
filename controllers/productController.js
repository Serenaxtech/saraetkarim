const productService = require('../services/productService');

/**
 * Controller class for managing products.
 */
class ProductController {
    /**
     * Get all products.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllProducts(req, res) {
        try {
            // Fetch all products from the service
            const products = await productService.getAllProducts();
            res.json(products);
        } catch (error) {
            console.error('Error fetching all products:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get a product by its ID.
     * @param {Object} req - Express request object containing the product ID.
     * @param {Object} res - Express response object.
     */
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            // Fetch the product with the specified ID
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get products by category ID.
     * @param {Object} req - Express request object containing the category ID.
     * @param {Object} res - Express response object.
     */
    async getProductByCategoryId(req, res) {
        try {
            const { categoryId } = req.params;
            // Fetch products for the specified category ID
            const products = await productService.getProductByCategoryId(categoryId);
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products by category ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create a new product.
     * @param {Object} req - Express request object containing product data.
     * @param {Object} res - Express response object.
     */
    async createProduct(req, res) {
        try {
            const productData = req.body;
            // Create a new product using the provided data
            const newProduct = await productService.createProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update an existing product.
     * @param {Object} req - Express request object containing product data.
     * @param {Object} res - Express response object.
     */
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const productData = req.body;
            // Update the product with the specified ID
            const isUpdated = await productService.updateProduct(id, productData);
            if (!isUpdated) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json({ message: 'Product updated successfully' });
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete a product by its ID.
     * @param {Object} req - Express request object containing the product ID.
     * @param {Object} res - Express response object.
     */
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            // Delete the product with the specified ID
            const isDeleted = await productService.deleteProduct(id);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ProductController();
