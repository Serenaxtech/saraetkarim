const shipmentService = require('../services/shipmentService');

class ShipmentController {

    async getAllShipments(req, res) {
        try {
            const shipments = await shipmentService.getAllShipments();
            res.json(shipments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getShipmentById(req, res) {
        try {
            const customerID = req.user.id;
            const { id } = req.params;
            const shipment = await shipmentService.getShipmentById(id, customerID);
            if (!shipment) {
                return res.status(404).json({ error: 'Shipment not found' });
            }
            res.json(shipment);
        } catch (error) {
            
            if (error.message === 'Shipment not found or access denied') {
                return res.status(403).json({ message: 'Access denied' });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createShipment(req, res) {
        try {
            const { order_ID, customer_ID } = req.body;
            const newShipment = await shipmentService.createShipment(order_ID, customer_ID);
            res.status(201).json(newShipment);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteShipment(req, res) {
        try {
            const { id } = req.params;
            const isDeleted = await shipmentService.deleteShipment(id);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Shipment not found' });
            }
            res.json({ message: 'Shipment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new ShipmentController();
