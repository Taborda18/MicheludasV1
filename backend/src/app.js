require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

// Importar rutas
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderSessionRoutes = require('./routes/orderSessionRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const ticketDetailRoutes = require('./routes/ticketDetailRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productIngredientRoutes = require('./routes/productIngredientRoutes');
const cashSessionRoutes = require('./routes/cashSessionRoutes');

const app = express();
const http = require('http');
const { initSocket } = require('./utils/socket');
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sessions', orderSessionRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/ticket-details', ticketDetailRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/product-ingredients', productIngredientRoutes);
app.use('/api/cash-sessions', cashSessionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Micheludas funcionando',
        endpoints: {
            roles: '/api/roles',
            users: '/api/users',
            products: '/api/products',
            sessions: '/api/sessions',
            tickets: '/api/tickets',
            ticketDetails: '/api/ticket-details',
            invoices: '/api/invoices',
            inventory: '/api/inventory',
            suppliers: '/api/suppliers',
            productIngredients: '/api/product-ingredients',
            cashSessions: '/api/cash-sessions'
        }
    });
});

// Conectar a la base de datos e iniciar servidor
const startServer = async () => {
    try {
        await connectDB();
        const server = http.createServer(app);
        initSocket(server);
        server.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌐 API available at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();