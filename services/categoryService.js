const { initDB } = require('../database/connection');
const Category = require('../Models/categoryModel');
const category = require('../Models/categoryModel');

class  CategoryService {
    constructor(){
        this.pool = null;
        this.init();
    }

    async init() {
        this.pool = await initDB(); 
    }

    async getAllCategories() {
        const [rows] = await this.pool.query('SELECT * FROM category');
        return rows.map(category.fromRow);
    }

    async getCategoryById(id) {
        const [rows] = await this.pool.query('SELECT * FROM category WHERE category_ID = ?', [id]);
        
        if (rows.length == 0) return null;
        
        return category.fromRow(rows[0]);
    }

    async createCategory(categoryName) {
        const { category_Name } = categoryName;

        const [result] = await this.pool.query(
            'INSERT INTO category (category_Name) VALUES (?)',
            [category_Name]
        );

        const createdCategory = new Category(result.insertId, category_Name);
        return createdCategory;
    }

    async updateCategory(id, categoryName) {
        const { category_Name } = categoryName;

        const [result] = await this.pool.query(
            'UPDATE category SET category_Name = ? WHERE category_ID = ?',
            [category_Name, id]
        );

        return result.affectedRows > 0;
    }

    async deleteCategory(id) {
        const [result] = await this.pool.query('DELETE FROM category WHERE category_ID = ?', [id]);
        return result.affectedRows === 1;
    }

}

module.exports = new CategoryService();