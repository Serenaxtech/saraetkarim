class Product {
    constructor(id, name, img, description, info, price, custId ) {
      this.id = id;
      this.name = name;
      this.img = img;
      this.description = description;
      this.info = info;
      this.price = price;
      this.custId = custId;
    }
  
    // Static method to map database row to User model
    // mapper to map the datafields from database to our user Model
    // the fields just like the database, we are mapping to js our own naming
    static fromRow(row) {
      return new Product(
        row.product_ID,
        row.product_Name,
        row.product_IMG,
        row.product_Description,
        row.product_Info,
        row.product_Price,
        row.category_ID
      );
    }
  }
  
  module.exports = Product;
  