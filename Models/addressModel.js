class Address {
    constructor(id, region, street, building, floor, moreDetails, customer_ID) {
      this.id = id;
      this.region = region;
      this.street = street;
      this.building = building;
      this.floor = floor;
      this.moreDetails = moreDetails;
      this.customer_ID = customer_ID;
    }
  
    // Static method to map database row to User model
    // mapper to map the datafields from database to our user Model
    // the fields just like the database, we are mapping to js our own naming
    static fromRow(row) {
      return new Address(
        row.address_ID,
        row.region,
        row.street,
        row.building,
        row.floor,
        row.moreDetails,
        row.customer_ID
      );
    }
  }
  
  module.exports = Address;
  