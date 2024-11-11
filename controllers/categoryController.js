const categoryService = require('../services/categoryService');

class CategoryController {

    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await categoryService.getCategoryById(id);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createCategory(req, res) {
        try {
            const categoryData = req.body;
            const newCategory = await categoryService.createCategory(categoryData);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const categoryData = req.body;
            const isUpdated = await categoryService.updateCategory(id, categoryData);
            if (!isUpdated) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json({ message: 'Category updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const isDeleted = await categoryService.deleteCategory(id);
            
            if (!isDeleted) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new CategoryController();