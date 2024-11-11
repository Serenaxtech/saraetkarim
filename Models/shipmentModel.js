class Shipment {
    constructor(id, orderid, custid) {
      this.id = id;
      this.orderid = orderid;
      this.custid = custid;
    }
  
    // Static method to map database row to User model
    // mapper to map the datafields from database to our user Model
    // the fields just like the database, we are mapping to js our own naming
    static fromRow(row) {
      return new Shipment(
        row.shipment_ID,
        row.order_ID,
        row.customer_ID
      );
    }
  }
  
  module.exports = Shipment;
  