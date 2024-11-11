const AddressService = require('../services/addressService');

/**
 * Controller class for managing addresses.
 */
class AddressController {
    /**
     * Get all addresses.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAlladdresses(req, res) {
        try {
            // Fetch all addresses from the service
            const addresses = await AddressService.getAlladdresses();
            res.json(addresses);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get an address by its ID.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getaddressById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const customer_ID = req.user.id;

            // Fetch the address for the given ID and customer ID
            const address = await AddressService.getaddressById(id, customer_ID);
            if (!address) {
                return res.status(404).json({ message: 'Address not found' });
            }

            res.json(address);
        } catch (error) {
            console.error('Error fetching address:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get addresses by customer ID.
     * Admins can fetch addresses for any customer.
     * Regular users can fetch their own addresses.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getaddressByCustId(req, res) {
        try {
            const requestingUserId = req.user.id;
            const userRole = req.user.role;
            
            // Determine the customer ID based on user role
            const customerId = userRole === 0 && req.params.customerId ? parseInt(req.params.customerId, 10) : requestingUserId;
            
            // Fetch addresses for the specified customer ID
            const address = await AddressService.getaddressByCustId(customerId);
            if (!address) {
                return res.status(404).json({ message: 'Address not found' });
            }
            res.json(address);
        } catch (error) {
            console.error('Error fetching address by customer ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Insert a new address.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async insertaddress(req, res) {
        try {
            const { region, street, building, floor, moreDetails } = req.body;
            const customer_ID = req.user.id;

            // Validate required fields
            if (!region || !street || !building || !floor || !customer_ID) {
                return res.status(400).json({ message: 'Fill all the required fields' });
            }

            // Insert the new address into the database
            await AddressService.insertaddress({ region, street, building, floor, moreDetails, customer_ID });
            res.status(201).json({ message: 'Address created successfully' });
        } catch (error) {
            console.error('Error creating address:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update an existing address.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async updateaddress(req, res) {
        try {
            const requestingUserId = req.user.id;
            const id = parseInt(req.params.id, 10);
            
            const { region, street, building, floor, moreDetails, customer_ID } = req.body;

            // Validate required fields
            if (!region || !street || !building || !floor || !customer_ID) {
                return res.status(400).json({ message: 'Fill all the required fields' });
            }

            // Update the address in the database
            const success = await AddressService.updateaddress(id, { region, street, building, floor, moreDetails, requestingUserId });

            if (!success) {
                return res.status(404).json({ message: 'Address not found or no changes made' });
            }

            res.json({ message: 'Address updated successfully' });
        } catch (error) {
            if (error.message === 'Address not found or access denied') {
                return res.status(403).json({ message: 'Access denied' });
            }

            console.error('Error updating address:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete an address.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async deleteaddress(req, res) {
        try {
            const requestingUserId = req.user.id;
            const id = parseInt(req.params.id, 10);

            // Delete the address from the database
            const success = await AddressService.deleteaddress(id, requestingUserId);
            if (!success) {
                return res.status(404).json({ message: 'Address not found' });
            }
            res.json({ message: 'Address deleted successfully' });
        } catch (error) {
            console.error('Error deleting address:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new AddressController();
