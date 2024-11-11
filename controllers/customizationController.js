const customizationService = require('../services/customizationService');

class CustomizationController {

    async getAllCustomizations(req, res) {
        try {
            const customizations = await customizationService.getAllCustomizations();
            res.json(customizations);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCustomizationById(req, res) {
        try {
            const { id } = req.params;
            const customization = await customizationService.getCustomizationById(id);
            if (!customization) {
                return res.status(404).json({ error: 'Customization not found' });
            }
            res.status(200).json(customization);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createCustomization(req, res) {
        try {
            const customizationData = req.body;
            const newCustomization = await customizationService.createCustomization(customizationData);
            res.status(201).json(newCustomization);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCustomization(req, res) {
        try {
            const { id } = req.params;
            const customizationData = req.body;
            const isUpdated = await customizationService.updateCustomization(id, customizationData);
            if (!isUpdated) {
                return res.status(404).json({ error: 'Customization not found' });
            }
            res.status(200).json({ message: 'Customization updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteCustomization(req, res) {
        try {
            const { id } = req.params;
            const isDeleted = await customizationService.deleteCustomization(id);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Customization not found' });
            }
            res.status(200).json({ message: 'Customization deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new CustomizationController();
