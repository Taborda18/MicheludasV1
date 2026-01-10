const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const tableRoutes = require('./routes/tableRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tables', tableRoutes);

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect('your_database_connection_string', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });