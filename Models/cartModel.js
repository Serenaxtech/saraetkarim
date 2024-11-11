class Cart {
    constructor(id, custId, prodId, quantity) {
      this.id = id;
      this.custId = custId;
      this.prodId = prodId;
      this.quantity = quantity;
    }
  
    // Static method to map database row to User model
    // mapper to map the datafields from database to our user Model
    // the fields just like the database, we are mapping to js our own naming
    static fromRow(row) {
      return new Cart(
        row.cart_ID,
        row.customer_ID,
        row.product_ID,
        row.quantity
      );
    }
  }
  
  module.exports = Cart;
  