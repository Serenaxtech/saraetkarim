const customerService = require('../services/customerService');

class customerController{

    async getAllCustomers(req , res){
        try{
            const customers = await customerService.getAllCustomers();
            res.json(customers);
        }catch(error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createCustomer(req , res){
        try {
            const {name, email, password, number} = req.body;
            if (!name || !email || !password || !number) {
                return res.status(400).json({ message: 'fill all the input' });
            }

            const newCustomer = await customerService.createCustomer({name, email, password, number});
            res.status(201).json({message: 'Customer created Succesfully'});
        } catch (error) {
            console.error('Error creating customer:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async createAdmin(req , res){
        try {
            const {name, email, password, number} = req.body;
            if (!name || !email || !password || !number) {
                return res.status(400).json({ message: 'fill all the input' });
            }

            const newCustomer = await customerService.createAdmin({name, email, password, number});
            res.status(201).json({message: 'Admin created Succesfully'});
        } catch (error) {
            console.error('Error creating Admin:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // async getCustomerById(req , res){
    //     try{
    //         const id = parseInt(req.params.id, 10);
    //         const customer = await customerService.getCustomerById(id);
    //         if (!customer) {
    //             return res.status(404).json({ message: 'Customer not found' });
    //         }
    //         res.json(customer);

    //     } catch (error) {
    //         console.error('Error fetching customer:', error);
    //         res.status(500).json({ message: 'Internal server error' });
    //     }
    // }

    async getCustomerById(req, res) {
        try {
            const requestingUserId = req.user.id;
            const userRole = req.user.role;
            
            const id = userRole === 0 && req.params.id ? parseInt(req.params.id, 10) : requestingUserId;
            
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

    async updateCustomer(req, res){
        try{
            const requestingUserId = req.user.id;
            const userRole = req.user.role;

            const id = userRole === 0 && req.params.id ? parseInt(req.params.id, 10) : requestingUserId;
            
            const {name, email, number} = req.body;
            if (!name || !email || !number) {
                return res.status(400).json({ message: 'fill all the input' });
            }
            const success = await customerService.updateCustomer(id, { name, email, number });
            
            if (!success) {
                return res.status(404).json({ message: 'Customer not found or no changes made' });
            }
            
            res.json({ message: 'Customer updated successfully' });
        } catch ( error ) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async deleteCustomer(req, res) {
        try {
            const { id } = req.params;
            const { customer_Password } = req.body;
    
            const isDeleted = await customerService.deleteCustomer(id, customer_Password);
            if (!isDeleted) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            res.status(200).json({ message: 'Customer deleted successfully' });
        } catch (error) {
            if (error.message === 'Incorrect password') {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }    

    async changeCustomerPassword(req, res){
        try{
            const id = req.user.id;
            const {email, old_password, new_password} = req.body;
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

    async signIn(req, res) {
        try {
            const { email, password } = req.body;
            const token = await customerService.signIn(email, password);
            res.status(200).json({ token });
        } catch (error) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    }
    
}

module.exports = new customerController();
