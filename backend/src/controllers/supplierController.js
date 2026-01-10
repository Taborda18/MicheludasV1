const Supplier = require('../models/Supplier');

const supplierController = {
    // Obtener todos los proveedores
    getAllSuppliers: async (req, res) => {
        try {
            const suppliers = await Supplier.findAll();
            res.json(suppliers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener proveedor por ID
    getSupplierById: async (req, res) => {
        try {
            const supplier = await Supplier.findById(req.params.id);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.json(supplier);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear nuevo proveedor
    createSupplier: async (req, res) => {
        try {
            const newSupplier = await Supplier.create(req.body);
            res.status(201).json(newSupplier);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar proveedor
    updateSupplier: async (req, res) => {
        try {
            const updatedSupplier = await Supplier.update(req.params.id, req.body);
            if (!updatedSupplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.json(updatedSupplier);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar proveedor
    deleteSupplier: async (req, res) => {
        try {
            await Supplier.delete(req.params.id);
            res.json({ message: 'Supplier deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = supplierController;
