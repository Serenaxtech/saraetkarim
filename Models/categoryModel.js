class Category {
    constructor(id, name) {
      this.id = id;
      this.name = name;
    }
  
    // Static method to map database row to User model
    // mapper to map the datafields from database to our user Model
    // the fields just like the database, we are mapping to js our own naming
    static fromRow(row) {
      return new Category(
        row.category_ID,
        row.category_Name
      );
    }
  }
  
  module.exports = Category;