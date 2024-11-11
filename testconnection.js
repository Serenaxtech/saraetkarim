// test-connection.js
const { initDB } = require('./database/connection');

const testConnection = async () => {
  try {
    await initDB(); // Initialize the database connection
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

testConnection();