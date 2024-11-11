const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { validateShipmentData, validateShipmentId } = require('../validations/shipmentValidator');


router.get('/', authenticate, authorize(0), shipmentController.getAllShipments);
router.get('/:id', authenticate, authorize(0, 1), validateShipmentId, shipmentController.getShipmentById);

router.post('/', authenticate, authorize(0), validateShipmentData, shipmentController.createShipment);

router.delete('/:id', authenticate, authorize(0), validateShipmentId, shipmentController.deleteShipment);

module.exports = router;
