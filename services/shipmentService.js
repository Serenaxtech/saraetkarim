const { initDB } = require('../database/connection');
const Shipment = require('../Models/shipmentModel');

/**
 * Service class for managing shipments.
 */
class ShipmentService {
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
     * Retrieve all shipments from the database.
     * @returns {Promise<Array>} An array of shipment objects.
     */
    async getAllShipments() {
        const [rows] = await this.pool.query('SELECT * FROM shipment');
        // Map each row to a Shipment model instance
        return rows.map(Shipment.fromRow);
    }

    /**
     * Get a shipment by its ID, ensuring it belongs to the specified customer.
     * @param {number} shipmentId - The ID of the shipment to retrieve.
     * @param {number} customerID - The ID of the customer requesting the shipment.
     * @returns {Promise<Object>} The shipment object.
     * @throws Will throw an error if the shipment is not found or access is denied.
     */
    async getShipmentById(shipmentId, customerID) {
        try {
            // Query the shipment matching the provided shipment ID and customer ID
            const [rows] = await this.pool.query(
                'SELECT * FROM shipment WHERE shipment_ID = ? AND customer_ID = ?',
                [shipmentId, customerID]
            );

            if (rows.length === 0) {
                throw new Error('Shipment not found or access denied');
            }

            return Shipment.fromRow(rows[0]);
        } catch (error) {
            // Re-throw the error to be handled by the calling function
            throw error;
        }
    }

    /**
     * Create a new shipment.
     * @param {number} orderId - The ID of the order associated with the shipment.
     * @param {number} customerId - The ID of the customer creating the shipment.
     * @returns {Promise<Object>} The newly created shipment object.
     */
    async createShipment(orderId, customerId) {
        // Insert a new shipment record into the database
        const [result] = await this.pool.query(
            'INSERT INTO shipment (order_ID, customer_ID) VALUES (?, ?)',
            [orderId, customerId]
        );
        return new Shipment(result.insertId, orderId, customerId);
    }

    /**
     * Delete a shipment by its ID.
     * @param {number} id - The ID of the shipment to delete.
     * @returns {Promise<boolean>} True if the shipment was deleted, false otherwise.
     */
    async deleteShipment(id) {
        // Delete the shipment record from the database
        const [result] = await this.pool.query('DELETE FROM shipment WHERE shipment_ID = ?', [id]);
        return result.affectedRows === 1;
    }
}

module.exports = new ShipmentService();
