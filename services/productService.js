const { initDB } = require('../database/connection');
const Product = require('../Models/productModel');

/**
 * Service class for managing product-related operations.
 */
class ProductService {
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
     * Retrieve all products from the database.
     * @returns {Promise<Array>} An array of product objects.
     */
    async getAllProducts() {
        const [rows] = await this.pool.query('SELECT * FROM product');
        // Map the rows to Product model instances
        return rows.map(Product.fromRow);
    }

    /**
     * Retrieve all products from the database.
     * @returns {Promise<Array>} An array of product objects.
     */
        async getAllProductsInStock() {
            const [rows] = await this.pool.query('SELECT * FROM product WHERE stock_quantity > 0');
            // Map the rows to Product model instances
            return rows.map(Product.fromRow);
        }

    /**
     * Get a product by its ID.
     * @param {number} id - The product ID.
     * @returns {Promise<Object|null>} The product object or null if not found.
     */
    async getProductById(id) {
        const [rows] = await this.pool.query('SELECT * FROM product WHERE product_ID = ?', [id]);
        
        if (rows.length === 0) return null;
        
        return Product.fromRow(rows[0]);
    }

    /**
     * Get products by category ID.
     * @param {number} categoryId - The category ID.
     * @returns {Promise<Array>} An array of product objects.
     */
    async getProductByCategoryId(categoryId) {
        const [rows] = await this.pool.query('SELECT * FROM product WHERE category_ID = ?', [categoryId]);
        return rows.map(Product.fromRow);
    }

    /**
     * Create a new product.
     * @param {Object} productData - The data for the new product.
     * @returns {Promise<Object>} The newly created product object.
     */
    async createProduct(productData) {
        const {
            product_IMG,
            product_Name,
            product_Description,
            product_Info,
            product_Price,
            category_ID,
            stock_quantity
        } = productData;

        // Insert the new product into the database
        const [result] = await this.pool.query(
            'INSERT INTO product (product_IMG, product_Name, product_Description, product_Info, product_Price, category_ID, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [product_IMG, product_Name, product_Description, product_Info, product_Price, category_ID, stock_quantity]
        );

        const createdProduct = new Product(
            result.insertId,
            product_IMG,
            product_Name,
            product_Description,
            product_Info,
            product_Price,
            category_ID,
            stock_quantity
        );

        return createdProduct;
    }

    /**
     * Update an existing product.
     * @param {number} id - The product ID.
     * @param {Object} productData - The updated product data.
     * @returns {Promise<boolean>} True if the update was successful, false otherwise.
     */
    async updateProduct(id, productData) {
        const {
            product_IMG,
            product_Name,
            product_Description,
            product_Info,
            product_Price,
            category_ID,
            stock_quantity
        } = productData;

        // Update the product in the database
        const [result] = await this.pool.query(
            'UPDATE product SET product_IMG = ?, product_Name = ?, product_Description = ?, product_Info = ?, product_Price = ?, category_ID = ?, stock_quantity = ? WHERE product_ID = ?',
            [product_IMG, product_Name, product_Description, product_Info, product_Price, category_ID, stock_quantity, id]
        );

        return result.affectedRows > 0;
    }


    async updateProductQuantity(id, quantity) {
        // Update the product in the database
        const [result] = await this.pool.query(
            'UPDATE product SET stock_quantity = ? WHERE product_ID = ?',
            [quantity, id]
        );

        return result.affectedRows > 0;
    }


    /**
     * Delete a product by its ID.
     * @param {number} id - The product ID.
     * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
     */
    async deleteProduct(id) {
        const [result] = await this.pool.query('DELETE FROM product WHERE product_ID = ?', [id]);
        return result.affectedRows === 1;
    }
}

module.exports = new ProductService();
