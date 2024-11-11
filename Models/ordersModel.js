class Orders {
    constructor(id, cartId) {
      this.id = id;
      this.cartId = cartId;
    }
  
    // Static method to map database row to User model
    // mapper to map the datafields from database to our user Model
    // the fields just like the database, we are mapping to js our own naming
    static fromRow(row) {
      return new Orders(
        row.order_ID,
        row.cart_ID
      );
    }
  }
  
  module.exports = Orders;
  