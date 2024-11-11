const express = require('express');
const dotenv = require('dotenv'); 
const customerRoutes = require('./routes/customerRoute'); 
const addressRoutes = require('./routes/addressRoute'); 
const reviewRoutes = require('./routes/reviewRoute');
const productRoutes = require('./routes/productRoute'); 
const categoryRoutes = require('./routes/categoryRoute'); 
const customizationRoutes = require('./routes/customizationRoute');
const cartRoutes = require('./routes/cartRoute');
const ordersRoutes = require('./routes/ordersRoute');
const shipmentRoutes = require('./routes/shipmentRoute');

dotenv.config(); 
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/customers', customerRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customizations', customizationRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/shipments', shipmentRoutes);



// Basic Route
app.get('/', (req, res) => {
  res.send('Welcome to Sara et Karim eCommerce!');
});


// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/*
-------------------------------------------------------------
// server.js
const express = require('express'); //done 
const dotenv = require('dotenv'); //done 
const userRoutes = require('./routes/userRoutes');  
const countryRoutes = require('./routes/countryRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config(); //done

const app = express(); //done 

// Middleware
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the User API');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3000; //done

//done
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});  */
