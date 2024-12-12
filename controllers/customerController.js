const customerService = require('../services/customerService');

/**
 * Controller class for managing customers.
 */
class customerController {
    /**
     * Get all customers.
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     */
    async getAllCustomers(req, res) {
        try {
            // Fetch all customers from the service
            const customers = await customerService.getAllCustomers();
            res.json(customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create a new customer.
     * @param {Object} req - Express request object containing customer data.
     * @param {Object} res - Express response object.
     */
    async createCustomer(req, res) {
        try {
            const { name, email, password, number } = req.body;
            // Validate required fields
            if (!name || !email || !password || !number) {
                return res.status(400).json({ message: 'Fill all the input' });
            }

            // Create a new customer using the service
            await customerService.createCustomer({ name, email, password, number });
            res.status(201).json({ message: 'Customer created successfully' });
        } catch (error) {
            console.error('Error creating customer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Create a new admin user.
     * @param {Object} req - Express request object containing admin data.
     * @param {Object} res - Express response object.
     */
    async createAdmin(req, res) {
        try {
            const { name, email, password, number } = req.body;
            // Validate required fields
            if (!name || !email || !password || !number) {
                return res.status(400).json({ message: 'Fill all the input' });
            }

            // Create a new admin using the service
            await customerService.createAdmin({ name, email, password, number });
            res.status(201).json({ message: 'Admin created successfully' });
        } catch (error) {
            console.error('Error creating admin:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Get customer details by ID.
     * Admins can fetch any customer; regular users can fetch their own data.
     * @param {Object} req - Express request object containing user information.
     * @param {Object} res - Express response object.
     */
    async getCustomerById(req, res) {
        try {
            const requestingUserId = req.user.id;
            const userRole = req.user.role;

            // Determine the ID to fetch based on user role
            const id = userRole === 0 && req.params.id ? parseInt(req.params.id, 10) : requestingUserId;

            // Fetch the customer data
            const customer = await customerService.getCustomerById(id);
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }

            res.json(customer);
        } catch (error) {
            console.error('Error fetching customer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Update customer details.
     * Admins can update any customer; regular users can update their own data.
     * @param {Object} req - Express request object containing updated data.
     * @param {Object} res - Express response object.
     */
    async updateCustomer(req, res) {
        try {
            const requestingUserId = req.user.id;
            const userRole = req.user.role;

            // Determine the ID to update based on user role
            const id = userRole === 0 && req.params.id ? parseInt(req.params.id, 10) : requestingUserId;

            const { name, email, number } = req.body;
            // Validate required fields
            if (!name || !email || !number) {
                return res.status(400).json({ message: 'Fill all the input' });
            }

            // Update the customer data
            const success = await customerService.updateCustomer(id, { name, email, number });

            if (!success) {
                return res.status(404).json({ message: 'Customer not found or no changes made' });
            }

            res.json({ message: 'Customer updated successfully' });
        } catch (error) {
            console.error('Error updating customer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Delete a customer.
     * @param {Object} req - Express request object containing customer ID and password.
     * @param {Object} res - Express response object.
     */
    async deleteCustomer(req, res) {
        try {
            const { id } = req.params;
            const { customer_Password } = req.body;

            // Delete the customer using the service
            const isDeleted = await customerService.deleteCustomer(id, customer_Password);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            res.status(200).json({ message: 'Customer deleted successfully' });
        } catch (error) {
            if (error.message === 'Incorrect password') {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            console.error('Error deleting customer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Change customer's password.
     * @param {Object} req - Express request object containing email, old password, and new password.
     * @param {Object} res - Express response object.
     */
    async changeCustomerPassword(req, res) {
        try {
            const id = req.user.id;
            const { email, old_password, new_password } = req.body;

            // Change the customer's password
            const success = await customerService.changeCustomerPassword(id, email, old_password, new_password);

            if (!success) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.json({ message: 'Customer password changed successfully' });
        } catch (error) {
            console.error('Error changing customer\'s password:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Sign in a customer.
     * @param {Object} req - Express request object containing email and password.
     * @param {Object} res - Express response object.
     */
    async signIn(req, res) {
        try {
            const { email, password } = req.body;
            // Authenticate the customer and get a token
            const token = await customerService.signIn(email, password);

            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000,
            });

            res.status(200).json({ token });
        } catch (error) {
            console.error('Error signing in customer:', error);
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    }
}

module.exports = new customerController();
