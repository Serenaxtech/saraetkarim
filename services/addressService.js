const { initDB } = require('../database/connection');
const address = require('../Models/addressModel');

class addressService{

    constructor(){
        this.pool = null;
        this.init();
    }

    async init() {
        this.pool = await initDB(); 
    }

    async getAlladdresses(){
        const [rows] = await this.pool.query('SELECT * FROM address');
        return rows.map(address.fromRow);
    }

    async getaddressByCustId(id){
        const [rows] = await this.pool.query('SELECT * FROM address WHERE customer_ID = ?', [id]);
        if(rows.length == 0) return null;
        return address.fromRow(rows[0]);
    }

    async getaddressById(id, customer_ID){
        const [rows] = await this.pool.query('SELECT * FROM address WHERE address_ID = ? and customer_ID = ?', [id, customer_ID]);
        if(rows.length == 0) return null;
        return address.fromRow(rows[0]);
    }

    async insertaddress(addressData){
        //! should be updated to allow only one address for a user
        const {region, street, building, floor, moreDetails, customer_ID} = addressData;
    
        const [result] = await this.pool.query(
            'INSERT INTO address (region, street, building, floor, moreDetails, customer_ID) VALUES(?,?,?,?,?,?)',
            [region, street, building, floor, moreDetails, customer_ID]
        );
    
        const insertedaddress = new address(result.insertId, region, street, building, floor, moreDetails, customer_ID);
        return insertedaddress;
    }

    async updateaddress(id, addressData){
        const {region, street, building, floor, moreDetails, requestingUserId} = addressData;

        const [addressRows] = await this.pool.query(
            'SELECT * FROM address WHERE address_ID = ? AND customer_ID = ?',
            [id, requestingUserId]
        );
        

        if (addressRows.length === 0) {
            throw new Error('Address not found or access denied');
        }

        const [result] = await this.pool.query(
            'UPDATE address SET region = ?, street = ? , building = ? , floor =? , moreDetails = ? WHERE address_ID = ? AND customer_ID = ?',
            [region, street, building, floor, moreDetails, id, requestingUserId]
        );
        return result.affectedRows>0;
    }

    async deleteaddress(id, customer_ID){
        const[result] = await this.pool.query('DELETE FROM address WHERE address_ID = ? and customer_ID = ?', [id, customer_ID])
        return result.affectedRows === 1;
    }
}
module.exports = new addressService();