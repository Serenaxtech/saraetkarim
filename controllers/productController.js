const productService = require('../services/productService');

class ProductController {

    async getAllProducts(req, res) {
        try {
            const products = await productService.getAllProducts();
            res.json(products);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getProductByCategoryId(req, res) {
        try {
            const { categoryId } = req.params;
            const products = await productService.getProductByCategoryId(categoryId);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createProduct(req, res) {
        try {
            const productData = req.body;
            const newProduct = await productService.createProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const productData = req.body;
            const isUpdated = await productService.updateProduct(id, productData);
            if (!isUpdated) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json({ message: 'Product updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const isDeleted = await productService.deleteProduct(id);
            
            if (!isDeleted) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

module.exports = new ProductController();