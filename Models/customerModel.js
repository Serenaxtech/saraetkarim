class Customer {
    constructor(id, name, email, password, number, role) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.password = password;
      this.number = number;
      this.role = role
    }
  
    // Static method to map database row to User model
    // mapper to map the datafields from database to our user Model
    // the fields just like the database, we are mapping to js our own naming
    static fromRow(row) {
      return new Customer(
        row.customer_ID,
        row.customer_FullName,
        row.customer_Email,
        row.customer_Password,
        row.customer_PhoneNumber,
        row.role
      );
    }
  }
  
  module.exports = Customer;
  