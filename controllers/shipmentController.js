const shipmentService = require('../services/shipmentService');

/**
 * Controller class for managing shipments.
 */
class ShipmentController {
    /**
     * Get all shipments.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllShipments(req, res) {
        try {
            // Fetch all shipments from the service
            const shipments = await shipmentService.getAllShipments();
            res.json(shipments);
        } catch (error) {
            console.error('Error fetching all shipments:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get a shipment by its ID.
     * @param {Object} req - Express request object containing user info and shipment ID.
     * @param {Object} res - Express response object.
     */
    async getShipmentById(req, res) {
        try {
            const customerID = req.user.id;
            const { id } = req.params;
            // Fetch the shipment for the given ID and customer ID
            const shipment = await shipmentService.getShipmentById(id, customerID);
            if (!shipment) {
                return res.status(404).json({ error: 'Shipment not found' });
            }
            res.json(shipment);
        } catch (error) {
            if (error.message === 'Shipment not found or access denied') {
                return res.status(403).json({ message: 'Access denied' });
            }
            console.error('Error fetching shipment by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create a new shipment.
     * @param {Object} req - Express request object containing shipment data.
     * @param {Object} res - Express response object.
     */
    async createShipment(req, res) {
        try {
            const { order_ID, customer_ID } = req.body;
            // Create a new shipment using the provided data
            const newShipment = await shipmentService.createShipment(order_ID, customer_ID);
            res.status(201).json(newShipment);
        } catch (error) {
            console.error('Error creating shipment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete a shipment by its ID.
     * @param {Object} req - Express request object containing the shipment ID.
     * @param {Object} res - Express response object.
     */
    async deleteShipment(req, res) {
        try {
            const { id } = req.params;
            // Delete the shipment with the specified ID
            const isDeleted = await shipmentService.deleteShipment(id);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Shipment not found' });
            }
            res.json({ message: 'Shipment deleted successfully' });
        } catch (error) {
            console.error('Error deleting shipment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ShipmentController();
