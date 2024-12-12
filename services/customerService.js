const { initDB } = require('../database/connection');
const Customer = require('../Models/customerModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Service class for managing customer-related operations.
 */
class CustomerService {
  constructor() {
    this.pool = null;
    this.init();
  }

  /**
   * Initialize the database connection pool.
   */
  async init() {
    this.pool = await initDB(); 
  }

  /**
   * Retrieve all customers from the database.
   * @returns {Promise<Array>} An array of customer objects.
   */
  async getAllCustomers() {
    const [rows] = await this.pool.query('SELECT * FROM customer');
    return rows.map(Customer.fromRow);
  }

  /**
   * Get a customer by their ID.
   * @param {number} id - The customer ID.
   * @returns {Promise<Object|null>} The customer object or null if not found.
   */
  async getCustomerById(id) {
    const [rows] = await this.pool.query(
      'SELECT customer_ID, customer_FullName, customer_Email, customer_PhoneNumber, role FROM customer WHERE customer_ID = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return Customer.fromRow(rows[0]);
  }

  /**
   * Create a new customer with normal user role.
   * @param {Object} customerData - The data for the new customer.
   * @returns {Promise<Object>} The newly created customer object.
   */
  async createCustomer(customerData) {
    const { name, email, password, number } = customerData;

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const normalUserRole = 1; // Role identifier for a normal user

    // Insert the new customer into the database
    const [result] = await this.pool.query(
      'INSERT INTO customer (customer_FullName, customer_Email, customer_Password, customer_PhoneNumber, role) VALUES(?,?,?,?,?)',
      [name, email, hashedPassword, number, normalUserRole]
    );

    const insertedCustomer = new Customer(result.insertId, name, email, hashedPassword, number);
    return insertedCustomer;
  }

  /**
   * Create a new admin user.
   * @param {Object} customerData - The data for the new admin.
   * @returns {Promise<Object>} The newly created admin object.
   */
  async createAdmin(customerData) {
    const { name, email, password, number } = customerData;

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const adminUserRole = 0; // Role identifier for an admin user

    // Insert the new admin into the database
    const [result] = await this.pool.query(
      'INSERT INTO customer (customer_FullName, customer_Email, customer_Password, customer_PhoneNumber, role) VALUES(?,?,?,?,?)',
      [name, email, hashedPassword, number, adminUserRole]
    );

    const insertedCustomer = new Customer(result.insertId, name, email, hashedPassword, number);
    return insertedCustomer;
  }

  /**
   * Update an existing customer's information.
   * @param {number} id - The customer ID.
   * @param {Object} customerData - The updated customer data.
   * @returns {Promise<boolean>} True if the update was successful, false otherwise.
   */
  async updateCustomer(id, customerData) {
    const { name, email, number } = customerData;
    const [result] = await this.pool.query(
      'UPDATE customer SET customer_FullName = ?, customer_Email = ?, customer_PhoneNumber = ? WHERE customer_ID = ?',
      [name, email, number, id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Delete a customer after verifying their password.
   * @param {number} id - The customer ID.
   * @param {string} customerPassword - The customer's password for verification.
   * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
   * @throws Will throw an error if the customer is not found or password is incorrect.
   */
  async deleteCustomer(id, customerPassword) {
    // Retrieve the stored password hash from the database
    const [rows] = await this.pool.query(
      'SELECT customer_Password FROM customer WHERE customer_ID = ?',
      [id]
    );
    if (rows.length === 0) {
      throw new Error('Customer not found');
    }

    const storedPasswordHash = rows[0].customer_Password;

    // Compare the provided password with the stored hash
    const isPasswordMatch = await bcrypt.compare(customerPassword, storedPasswordHash);
    if (!isPasswordMatch) {
      throw new Error('Incorrect password');
    }

    // Delete the customer from the database
    const [result] = await this.pool.query(
      'DELETE FROM customer WHERE customer_ID = ?',
      [id]
    );
    return result.affectedRows === 1;
  }

  /**
   * Check if an email already exists in the database.
   * @param {string} email - The email to check.
   * @returns {Promise<boolean>} True if the email exists, false otherwise.
   */
  async emailExists(email) {
    const [rows] = await this.pool.query(
      'SELECT * FROM customer WHERE customer_Email = ?',
      [email]
    );
    return rows.length > 0;
  }

  /**
   * Check if an email exists for another user (excluding the provided user ID).
   * @param {string} email - The email to check.
   * @param {number} userId - The user ID to exclude.
   * @returns {Promise<boolean>} True if the email exists for another user, false otherwise.
   */
  async emailExistsForAnotherUser(email, userId) {
    const [rows] = await this.pool.query(
      'SELECT customer_ID FROM customer WHERE customer_Email = ? AND customer_ID != ?',
      [email, userId]
    );
    return rows.length > 0;
  }
  
  /**
   * Change a customer's password after verifying the old password.
   * @param {number} id - The customer ID.
   * @param {string} email - The customer's email.
   * @param {string} oldPassword - The current password.
   * @param {string} newPassword - The new password.
   * @returns {Promise<boolean>} True if the password was changed successfully, false otherwise.
   * @throws Will throw an error if the customer is not found or old password is incorrect.
   */
  async changeCustomerPassword(id, email, oldPassword, newPassword) {
    // Retrieve the stored password hash for the email
    const [rows] = await this.pool.query(
      'SELECT customer_Password FROM customer WHERE customer_Email = ?',
      [email]
    );
    
    if (rows.length === 0) {
      throw new Error('Customer not found');
    }

    const storedPassword = rows[0].customer_Password;

    // Verify the old password
    const isPasswordMatch = await bcrypt.compare(oldPassword, storedPassword);
    if (!isPasswordMatch) {
      throw new Error('Old password is incorrect');
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const [result] = await this.pool.query(
      'UPDATE customer SET customer_Password = ? WHERE customer_Email = ?',
      [hashedNewPassword, email]
    );

    return result.affectedRows > 0;
  }

  /**
   * Authenticate a customer and generate a JWT token.
   * @param {string} email - The customer's email.
   * @param {string} password - The customer's password.
   * @returns {Promise<string>} The JWT token if authentication is successful.
   * @throws Will throw an error if authentication fails.
   */
  async signIn(email, password) {
    // Retrieve the customer by email
    const [rows] = await this.pool.query(
      'SELECT * FROM customer WHERE customer_Email = ?',
      [email]
    );
    let customer = rows[0];

    // Generate a dummy hash to prevent timing attacks
    const dummyHash = await bcrypt.hash('dummy_password', 10);

    // Use the stored password hash if customer exists, else use dummy hash
    const storedPasswordHash = customer ? customer.customer_Password : dummyHash;

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, storedPasswordHash);

    if (!customer || !isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: customer.customer_ID, email: customer.customer_Email, role: customer.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return token;
  }
}

module.exports = new CustomerService();
