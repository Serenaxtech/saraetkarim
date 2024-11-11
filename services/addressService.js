const { initDB } = require('../database/connection');
const address = require('../Models/addressModel');

/**
 * Service class for managing addresses.
 */
class addressService {
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
     * Retrieve all addresses from the database.
     * @returns {Promise<Array>} An array of address objects.
     */
    async getAlladdresses() {
        const [rows] = await this.pool.query('SELECT * FROM address');
        // Map the rows to address objects
        return rows.map(address.fromRow);
    }

    /**
     * Get an address by customer ID.
     * @param {number} id - The customer ID.
     * @returns {Promise<Object|null>} The address object or null if not found.
     */
    async getaddressByCustId(id) {
        const [rows] = await this.pool.query('SELECT * FROM address WHERE customer_ID = ?', [id]);
        if (rows.length === 0) return null;
        return address.fromRow(rows[0]);
    }

    /**
     * Get an address by address ID and customer ID.
     * @param {number} id - The address ID.
     * @param {number} customer_ID - The customer ID.
     * @returns {Promise<Object|null>} The address object or null if not found.
     */
    async getaddressById(id, customer_ID) {
        const [rows] = await this.pool.query('SELECT * FROM address WHERE address_ID = ? and customer_ID = ?', [id, customer_ID]);
        if (rows.length === 0) return null;
        return address.fromRow(rows[0]);
    }

    /**
     * Insert a new address into the database.
     * @param {Object} addressData - The address data to insert.
     * @returns {Promise<Object>} The inserted address object.
     */
    async insertaddress(addressData) {
        // Note: Should be updated to allow only one address per user
        const { region, street, building, floor, moreDetails, customer_ID } = addressData;
    
        const [result] = await this.pool.query(
            'INSERT INTO address (region, street, building, floor, moreDetails, customer_ID) VALUES(?,?,?,?,?,?)',
            [region, street, building, floor, moreDetails, customer_ID]
        );
    
        const insertedaddress = new address(result.insertId, region, street, building, floor, moreDetails, customer_ID);
        return insertedaddress;
    }

    /**
     * Update an existing address.
     * @param {number} id - The address ID.
     * @param {Object} addressData - The updated address data.
     * @returns {Promise<boolean>} True if the address was updated, false otherwise.
     */
    async updateaddress(id, addressData) {
        const { region, street, building, floor, moreDetails, requestingUserId } = addressData;

        // Check if the address exists and belongs to the requesting user
        const [addressRows] = await this.pool.query(
            'SELECT * FROM address WHERE address_ID = ? AND customer_ID = ?',
            [id, requestingUserId]
        );

        if (addressRows.length === 0) {
            throw new Error('Address not found or access denied');
        }

        // Update the address in the database
        const [result] = await this.pool.query(
            'UPDATE address SET region = ?, street = ?, building = ?, floor = ?, moreDetails = ? WHERE address_ID = ? AND customer_ID = ?',
            [region, street, building, floor, moreDetails, id, requestingUserId]
        );
        return result.affectedRows > 0;
    }

    /**
     * Delete an address by its ID and customer ID.
     * @param {number} id - The address ID.
     * @param {number} customer_ID - The customer ID.
     * @returns {Promise<boolean>} True if the address was deleted, false otherwise.
     */
    async deleteaddress(id, customer_ID) {
        const [result] = await this.pool.query(
            'DELETE FROM address WHERE address_ID = ? and customer_ID = ?',
            [id, customer_ID]
        );
        return result.affectedRows === 1;
    }
}

module.exports = new addressService();
