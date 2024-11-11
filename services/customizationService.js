const { initDB } = require('../database/connection');
const Customization = require('../Models/customizationModel');

class CustomizationService {
    constructor() {
        this.pool = null;
        this.init();
    }

    async init() {
        this.pool = await initDB(); 
    }

    async getAllCustomizations() {
        const [rows] = await this.pool.query('SELECT * FROM customization');
        return rows.map(Customization.fromRow);
    }

    async getCustomizationById(id) {
        const [rows] = await this.pool.query('SELECT * FROM customization WHERE customization_ID = ?', [id]);
        if (rows.length === 0) return null;
        return Customization.fromRow(rows[0]);
    }

    async createCustomization(customizationData) {
        const { size, color, product_ID } = customizationData;
        const [result] = await this.pool.query(
            'INSERT INTO customization (customization_Size, customization_Color, product_ID) VALUES (?, ?, ?)',
            [size, color, product_ID]
        );
        return new Customization(result.insertId, size, color, product_ID);
    }

    async updateCustomization(id, customizationData) {
        const { size, color, product_ID } = customizationData;
        const [result] = await this.pool.query(
            'UPDATE customization SET customization_Size = ?, customization_Color = ?, product_ID = ? WHERE customization_ID = ?',
            [size, color, product_ID, id]
        );
        return result.affectedRows > 0;
    }

    async deleteCustomization(id) {
        const [result] = await this.pool.query('DELETE FROM customization WHERE customization_ID = ?', [id]);
        return result.affectedRows === 1;
    }
}

module.exports = new CustomizationService();
