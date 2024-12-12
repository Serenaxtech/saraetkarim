const express = require('express');
const dotenv = require('dotenv'); 
const path = require('path');
const customerRoutes = require('./routes/customerRoute'); 
const addressRoutes = require('./routes/addressRoute'); 
const reviewRoutes = require('./routes/reviewRoute');
const productRoutes = require('./routes/productRoute'); 
const categoryRoutes = require('./routes/categoryRoute'); 
const customizationRoutes = require('./routes/customizationRoute');
const cartRoutes = require('./routes/cartRoute');
const ordersRoutes = require('./routes/ordersRoute');
const shipmentRoutes = require('./routes/shipmentRoute');
const cookieParser = require('cookie-parser');
const authenticate = require('./middlewares/authenticate');
const authorize = require('./middlewares/authorize');

dotenv.config(); 
const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

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



// // Basic Route
// app.get('/', (req, res) => {
//   res.send('Welcome to Sara et Karim eCommerce!');
// });

app.get('/', (req, res) => {
    res.render('index'); // Main page
});

app.get('/login', (req, res) => {
  res.render('pages/signup');
});

app.get('/profile', authenticate, (req, res) => {
  res.render('pages/profile', { customerId: req.user.id });
});

app.get('/products', authenticate, (req, res) => {
  res.render('pages/products');
});


app.get('/products/:id', (req, res) => {
  res.render('pages/productDetails', { productId: req.params.id });
});


app.get('/cart', authenticate, (req, res) => {
  res.render('pages/cart', { customerId: req.user.id });
});

app.get('/address', authenticate, (req, res) => {
  res.render('pages/address');
});


app.get('/thankyou', authenticate, (req, res) => {
  res.render('pages/thankYou');
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


