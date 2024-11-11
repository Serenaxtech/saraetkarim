const { initDB } = require('../database/connection');
const Shipment = require('../Models/shipmentModel');

class ShipmentService {
    constructor() {
        this.pool = null;
        this.init();
    }

    async init() {
        this.pool = await initDB();
    }

    async getAllShipments() {
        const [rows] = await this.pool.query('SELECT * FROM shipment');
        return rows.map(Shipment.fromRow);
    }

    async getShipmentById(shipmentId, customerID) {
        try {
            const [rows] = await this.pool.query(
                'SELECT * FROM shipment WHERE shipment_ID = ? AND customer_ID = ?',
                [shipmentId, customerID]
            );
    
            if (rows.length === 0) {
                throw new Error('Shipment not found or access denied');
            }
    
            return Shipment.fromRow(rows[0]);
        } catch (error) {
            // console.error("Error in getShipmentById:", error);
            throw error;
        }
    }
    

    async createShipment(orderId, customerId) {
        const [result] = await this.pool.query(
            'INSERT INTO shipment (order_ID, customer_ID) VALUES (?, ?)',
            [orderId, customerId]
        );
        return new Shipment(result.insertId, orderId, customerId);
    }

    async deleteShipment(id) {
        const [result] = await this.pool.query('DELETE FROM shipment WHERE shipment_ID = ?', [id]);
        return result.affectedRows === 1;
    }
}

module.exports = new ShipmentService();
