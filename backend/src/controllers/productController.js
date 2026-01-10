const Product = require('../models/Product');

const productController = {
    // Obtener todos los productos
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener solo productos activos
    getActiveProducts: async (req, res) => {
        try {
            const products = await Product.findActive();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener producto por ID
    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear nuevo producto
    createProduct: async (req, res) => {
        try {
            const newProduct = await Product.create(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar producto
    updateProduct: async (req, res) => {
        try {
            const updatedProduct = await Product.update(req.params.id, req.body);
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Activar/Desactivar producto
    toggleProductActive: async (req, res) => {
        try {
            const product = await Product.toggleActive(req.params.id);
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar producto
    deleteProduct: async (req, res) => {
        try {
            await Product.delete(req.params.id);
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productController;
