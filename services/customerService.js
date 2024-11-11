const { initDB } = require('../database/connection');
const Customer = require('../Models/customerModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class CustomerService {
  constructor() {
    this.pool = null;
    this.init();
  }

  async init() {
    this.pool = await initDB(); 
  }

  async getAllCustomers(){
    const [rows] = await this.pool.query('SELECT * FROM customer');
    return rows.map(Customer.fromRow);
  }

  async getCustomerById(id){
    const [rows] = await this.pool.query('SELECT customer_ID, customer_FullName, customer_Email, customer_PhoneNumber, role FROM customer WHERE customer_ID = ?', [id]);
    if(rows.length == 0) return null;
    return Customer.fromRow(rows[0]);
  }

  async createCustomer(customerData){
    const {name, email, password, number} = customerData;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const normalUserRole = 1

    const [result] = await this.pool.query(
      'INSERT INTO customer (customer_FullName, customer_Email, customer_Password, customer_PhoneNumber, role) VALUES(?,?,?,?,?)',
      [name, email, hashedPassword, number, normalUserRole]
    );

    const insertedCustomer = new Customer(result.insertId, name, email, hashedPassword, number);
    return insertedCustomer;
  }

  async createAdmin(customerData){
    const {name, email, password, number} = customerData;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const adminUserRole = 0

    const [result] = await this.pool.query(
      'INSERT INTO customer (customer_FullName, customer_Email, customer_Password, customer_PhoneNumber, role) VALUES(?,?,?,?,?)',
      [name, email, hashedPassword, number, adminUserRole]
    );

    const insertedCustomer = new Customer(result.insertId, name, email, hashedPassword, number);
    return insertedCustomer;
  }

  async updateCustomer(id, customerData){
    const {name, email, number} = customerData;
    const [result] = await this.pool.query(
      'UPDATE customer SET customer_FullName = ?, customer_Email = ?, customer_PhoneNumber =? WHERE customer_ID =?',
      [name, email, number, id]
    );
    return result.affectedRows>0;
  }

  async deleteCustomer(id, customerPassword) {
      const [rows] = await this.pool.query('SELECT customer_Password FROM customer WHERE customer_ID = ?', [id]);
      if (rows.length === 0) {
          throw new Error('Customer not found');
      }

      const storedPasswordHash = rows[0].customer_Password;


      const isPasswordMatch = await bcrypt.compare(customerPassword, storedPasswordHash);
      if (!isPasswordMatch) {
          throw new Error('Incorrect password');
      }

      const [result] = await this.pool.query('DELETE FROM customer WHERE customer_ID = ?', [id]);
      return result.affectedRows === 1;
  }

  async emailExists(email){
    const [rows] = await this.pool.query('SELECT * FROM customer WHERE customer_Email = ?', [email]);
    return rows.length > 0;
  }

  async emailExistsForAnotherUser(email, userId) {
    const [rows] = await this.pool.query(
      'SELECT customer_ID FROM customer WHERE customer_Email = ? AND customer_ID != ?',
      [email, userId]
    );

    return rows.length > 0;
  }
  
  /*
  Password change functionality
  */
  async changeCustomerPassword(id, email, oldPassword, newPassword) {
    const [rows] = await this.pool.query('SELECT customer_Password FROM customer WHERE customer_Email = ?', [email]);
    
    if (rows.length === 0) {
      throw new Error('Customer not found');
    }

    const storedPassword = rows[0].customer_Password;

    const isPasswordMatch = await bcrypt.compare(oldPassword, storedPassword);
    if (!isPasswordMatch) {
      throw new Error('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await this.pool.query(
      'UPDATE customer SET customer_Password = ? WHERE customer_Email = ?',
      [hashedNewPassword, email]
    );

    return result.affectedRows > 0;
  }

  async signIn(email, password) {
      const [rows] = await this.pool.query('SELECT * FROM customer WHERE customer_Email = ?', [email]);
      let customer = rows[0];

      const dummyHash = await bcrypt.hash('dummy_password', 10);

      const storedPasswordHash = customer ? customer.customer_Password : dummyHash;

      const isPasswordValid = await bcrypt.compare(password, storedPasswordHash);

      if (!customer || !isPasswordValid) {
          throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
          { id: customer.customer_ID, email: customer.customer_Email, role: customer.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      return token;
  }
}

module.exports = new CustomerService();