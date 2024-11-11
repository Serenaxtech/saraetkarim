class Customization {
    constructor(id, size, color, prodId) {
      this.id = id;
      this.size = size;
      this.color = color;
      this.prodId = prodId;
    }
  
    // Static method to map database row to User model
    // mapper to map the datafields from database to our user Model
    // the fields just like the database, we are mapping to js our own naming
    static fromRow(row) {
      return new Customization(
        row.customization_ID,
        row.customization_Size,
        row.customization_Color,
        row.product_ID
      );
    }
  }
  
  module.exports = Customization;
  