const Inventory = require('../models/Inventory');

const inventoryController = {
    // Obtener todo el inventario
    getAllInventory: async (req, res) => {
        try {
            const inventory = await Inventory.findAll();
            res.json(inventory);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener item por ID
    getInventoryById: async (req, res) => {
        try {
            const item = await Inventory.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener items con stock bajo
    getLowStockItems: async (req, res) => {
        try {
            const threshold = req.query.threshold || 10;
            const items = await Inventory.findLowStock(threshold);
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear nuevo item de inventario
    createInventoryItem: async (req, res) => {
        try {
            const newItem = await Inventory.create(req.body);
            res.status(201).json(newItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar item de inventario
    updateInventoryItem: async (req, res) => {
        try {
            const updatedItem = await Inventory.update(req.params.id, req.body);
            if (!updatedItem) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            res.json(updatedItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar stock (agregar o quitar)
    updateStock: async (req, res) => {
        try {
            const { quantity } = req.body;
            if (quantity === undefined) {
                return res.status(400).json({ message: 'Quantity is required' });
            }
            const updatedItem = await Inventory.updateStock(req.params.id, quantity);
            if (!updatedItem) {
                return res.status(404).json({ message: 'Inventory item not found' });
            }
            res.json(updatedItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar item
    deleteInventoryItem: async (req, res) => {
        try {
            await Inventory.delete(req.params.id);
            res.json({ message: 'Inventory item deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = inventoryController;
