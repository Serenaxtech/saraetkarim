const { initDB } = require('../database/connection');
const Customization = require('../Models/customizationModel');

/**
 * Service class for managing customizations.
 */
class CustomizationService {
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
     * Retrieve all customizations from the database.
     * @returns {Promise<Array>} An array of customization objects.
     */
    async getAllCustomizations() {
        const [rows] = await this.pool.query('SELECT * FROM customization');
        // Map the rows to Customization model instances
        return rows.map(Customization.fromRow);
    }

    /**
     * Get a customization by its ID.
     * @param {number} id - The customization ID.
     * @returns {Promise<Object|null>} The customization object or null if not found.
     */
    async getCustomizationById(id) {
        const [rows] = await this.pool.query('SELECT * FROM customization WHERE customization_ID = ?', [id]);
        if (rows.length === 0) return null;
        return Customization.fromRow(rows[0]);
    }

    /**
     * Create a new customization.
     * @param {Object} customizationData - The data for the new customization.
     * @returns {Promise<Object>} The newly created customization object.
     */
    async createCustomization(customizationData) {
        const { size, color, product_ID } = customizationData;
        const [result] = await this.pool.query(
            'INSERT INTO customization (customization_Size, customization_Color, product_ID) VALUES (?, ?, ?)',
            [size, color, product_ID]
        );
        return new Customization(result.insertId, size, color, product_ID);
    }

    /**
     * Update an existing customization.
     * @param {number} id - The customization ID.
     * @param {Object} customizationData - The updated customization data.
     * @returns {Promise<boolean>} True if the update was successful, false otherwise.
     */
    async updateCustomization(id, customizationData) {
        const { size, color, product_ID } = customizationData;
        const [result] = await this.pool.query(
            'UPDATE customization SET customization_Size = ?, customization_Color = ?, product_ID = ? WHERE customization_ID = ?',
            [size, color, product_ID, id]
        );
        return result.affectedRows > 0;
    }

    /**
     * Delete a customization by its ID.
     * @param {number} id - The customization ID.
     * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
     */
    async deleteCustomization(id) {
        const [result] = await this.pool.query('DELETE FROM customization WHERE customization_ID = ?', [id]);
        return result.affectedRows === 1;
    }
}

module.exports = new CustomizationService();
