class Review {
    constructor(id, custId, prodId, rating, reviewtext) {
      this.id = id;
      this.custId = custId;
      this.prodId = prodId;
      this.rating = rating;
      this.reviewtext = reviewtext;
    }
  
    // Static method to map database row to User model
    // mapper to map the datafields from database to our user Model
    // the fields just like the database, we are mapping to js our own naming
    static fromRow(row) {
      return new Review(
        row.review_ID,
        row.customer_ID,
        row.product_ID,
        row.rating,
        row.review_Text
      );
    }
  }
  
  module.exports = Review;
  