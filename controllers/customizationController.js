const customizationService = require('../services/customizationService');

/**
 * Controller class for managing customizations.
 */
class CustomizationController {
    /**
     * Get all customizations.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllCustomizations(req, res) {
        try {
            // Fetch all customizations from the service
            const customizations = await customizationService.getAllCustomizations();
            res.json(customizations);
        } catch (error) {
            console.error('Error fetching customizations:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get a customization by its ID.
     * @param {Object} req - Express request object containing the customization ID.
     * @param {Object} res - Express response object.
     */
    async getCustomizationById(req, res) {
        try {
            const { id } = req.params;
            // Fetch the customization with the specified ID
            const customization = await customizationService.getCustomizationById(id);
            if (!customization) {
                return res.status(404).json({ error: 'Customization not found' });
            }
            res.status(200).json(customization);
        } catch (error) {
            console.error('Error fetching customization by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create a new customization.
     * @param {Object} req - Express request object containing customization data.
     * @param {Object} res - Express response object.
     */
    async createCustomization(req, res) {
        try {
            const customizationData = req.body;
            // Create a new customization using the provided data
            const newCustomization = await customizationService.createCustomization(customizationData);
            res.status(201).json(newCustomization);
        } catch (error) {
            console.error('Error creating customization:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update an existing customization.
     * @param {Object} req - Express request object containing customization data.
     * @param {Object} res - Express response object.
     */
    async updateCustomization(req, res) {
        try {
            const { id } = req.params;
            const customizationData = req.body;
            // Update the customization with the specified ID
            const isUpdated = await customizationService.updateCustomization(id, customizationData);
            if (!isUpdated) {
                return res.status(404).json({ error: 'Customization not found' });
            }
            res.status(200).json({ message: 'Customization updated successfully' });
        } catch (error) {
            console.error('Error updating customization:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete a customization by its ID.
     * @param {Object} req - Express request object containing the customization ID.
     * @param {Object} res - Express response object.
     */
    async deleteCustomization(req, res) {
        try {
            const { id } = req.params;
            // Delete the customization with the specified ID
            const isDeleted = await customizationService.deleteCustomization(id);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Customization not found' });
            }
            res.status(200).json({ message: 'Customization deleted successfully' });
        } catch (error) {
            console.error('Error deleting customization:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new CustomizationController();
