const { initDB } = require('../database/connection');
const Category = require('../Models/categoryModel');
const category = require('../Models/categoryModel');

/**
 * Service class for managing categories.
 */
class CategoryService {
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
     * Retrieve all categories from the database.
     * @returns {Promise<Array>} An array of category objects.
     */
    async getAllCategories() {
        const [rows] = await this.pool.query('SELECT * FROM category');
        // Map the rows to category objects
        return rows.map(category.fromRow);
    }

    /**
     * Get a category by its ID.
     * @param {number} id - The category ID.
     * @returns {Promise<Object|null>} The category object or null if not found.
     */
    async getCategoryById(id) {
        const [rows] = await this.pool.query('SELECT * FROM category WHERE category_ID = ?', [id]);
        
        if (rows.length === 0) return null;
        
        return category.fromRow(rows[0]);
    }

    /**
     * Create a new category.
     * @param {Object} categoryName - The category data containing the name.
     * @returns {Promise<Object>} The newly created category object.
     */
    async createCategory(categoryName) {
        const { category_Name } = categoryName;

        // Insert the new category into the database
        const [result] = await this.pool.query(
            'INSERT INTO category (category_Name) VALUES (?)',
            [category_Name]
        );

        const createdCategory = new Category(result.insertId, category_Name);
        return createdCategory;
    }

    /**
     * Update an existing category.
     * @param {number} id - The category ID.
     * @param {Object} categoryName - The updated category data.
     * @returns {Promise<boolean>} True if the update was successful, false otherwise.
     */
    async updateCategory(id, categoryName) {
        const { category_Name } = categoryName;

        // Update the category in the database
        const [result] = await this.pool.query(
            'UPDATE category SET category_Name = ? WHERE category_ID = ?',
            [category_Name, id]
        );

        return result.affectedRows > 0;
    }

    /**
     * Delete a category by its ID.
     * @param {number} id - The category ID.
     * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
     */
    async deleteCategory(id) {
        const [result] = await this.pool.query('DELETE FROM category WHERE category_ID = ?', [id]);
        return result.affectedRows === 1;
    }
}

module.exports = new CategoryService();
