const { initDB } = require('../database/connection');
const product = require('../Models/productModel');

class  ProductService {
    constructor(){
        this.pool = null;
        this.init();
    }

    async init() {
        this.pool = await initDB(); 
    }

    async getAllProducts() {
        const [rows] = await this.pool.query('SELECT * FROM product');
        return rows.map(product.fromRow);
    }

    async getProductById(id) {
        const [rows] = await this.pool.query('SELECT * FROM product WHERE product_ID = ?', [id]);
        
        if (rows.length == 0) return null;
        
        return product.fromRow(rows[0]);
    }

    async getProductByCategoryId(categoryId) {
        const [rows] = await this.pool.query('SELECT * FROM product WHERE category_ID = ?', [categoryId]);
        return rows.map(product.fromRow);
    }

    async createProduct(productData) {
        const { product_IMG, product_Name, product_Description,
                product_Info, product_Price, category_ID } = productData;

        const [result] = await this.pool.query(
            'INSERT INTO product (product_IMG, product_Name, product_Description, product_Info, product_Price, category_ID) VALUES (?, ?, ?, ?, ?, ?)',
            [product_IMG, product_Name, product_Description, product_Info, product_Price, category_ID]
        );

        const createdProduct = new product(result.insertId, product_IMG, product_Name, product_Description, product_Info, product_Price, category_ID);
        return createdProduct;
    }

    async updateProduct(id, productData) {
        const { product_IMG, product_Name, product_Description,
            product_Info, product_Price, category_ID } = productData;

        const [result] = await this.pool.query(
            'UPDATE product SET product_IMG = ?, product_Name = ?, product_Description = ?, product_Info = ?, product_Price = ?, category_ID = ? WHERE product_ID = ?',
            [product_IMG, product_Name, product_Description, product_Info, product_Price, category_ID, id]
        );

        return result.affectedRows > 0;
    }

    async deleteProduct(id) {
        const [result] = await this.pool.query('DELETE FROM product WHERE product_ID = ?', [id]);
        return result.affectedRows === 1;
    }

}

module.exports = new ProductService();