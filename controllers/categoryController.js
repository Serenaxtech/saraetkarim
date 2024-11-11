const categoryService = require('../services/categoryService');

/**
 * Controller class for managing categories.
 */
class CategoryController {
    /**
     * Get all categories.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllCategories(req, res) {
        try {
            // Fetch all categories from the service
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get a category by its ID.
     * @param {Object} req - Express request object containing the category ID.
     * @param {Object} res - Express response object.
     */
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            // Fetch the category with the specified ID
            const category = await categoryService.getCategoryById(id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json(category);
        } catch (error) {
            console.error('Error fetching category by ID:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create a new category.
     * @param {Object} req - Express request object containing category data.
     * @param {Object} res - Express response object.
     */
    async createCategory(req, res) {
        try {
            const categoryData = req.body;
            // Create a new category using the provided data
            const newCategory = await categoryService.createCategory(categoryData);
            res.status(201).json(newCategory);
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update an existing category.
     * @param {Object} req - Express request object containing category data.
     * @param {Object} res - Express response object.
     */
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const categoryData = req.body;
            // Update the category with the specified ID
            const isUpdated = await categoryService.updateCategory(id, categoryData);
            if (!isUpdated) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json({ message: 'Category updated successfully' });
        } catch (error) {
            console.error('Error updating category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete a category by its ID.
     * @param {Object} req - Express request object containing the category ID.
     * @param {Object} res - Express response object.
     */
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            // Delete the category with the specified ID
            const isDeleted = await categoryService.deleteCategory(id);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Error deleting category:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new CategoryController();
