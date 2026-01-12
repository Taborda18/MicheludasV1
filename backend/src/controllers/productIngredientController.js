const ProductIngredient = require('../models/ProductIngredient');

const productIngredientController = {
    // Obtener todos los ingredientes
    getAllIngredients: async (req, res) => {
        try {
            const ingredients = await ProductIngredient.findAll();
            res.json(ingredients);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener ingredientes por producto
    getIngredientsByProduct: async (req, res) => {
        try {
            const ingredients = await ProductIngredient.findByProductId(req.params.productId);
            res.json(ingredients);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener ingrediente por ID
    getIngredientById: async (req, res) => {
        try {
            const ingredient = await ProductIngredient.findById(req.params.id);
            if (!ingredient) {
                return res.status(404).json({ message: 'Ingredient not found' });
            }
            res.json(ingredient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear ingrediente
    createIngredient: async (req, res) => {
        try {
            const newIngredient = await ProductIngredient.create(req.body);
            res.status(201).json(newIngredient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar ingrediente
    updateIngredient: async (req, res) => {
        try {
            const updatedIngredient = await ProductIngredient.update(req.params.id, req.body);
            if (!updatedIngredient) {
                return res.status(404).json({ message: 'Ingredient not found' });
            }
            res.json(updatedIngredient);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar ingrediente
    deleteIngredient: async (req, res) => {
        try {
            await ProductIngredient.delete(req.params.id);
            res.json({ message: 'Ingredient deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar todos los ingredientes de un producto
    deleteByProduct: async (req, res) => {
        try {
            await ProductIngredient.deleteByProductId(req.params.productId);
            res.json({ message: 'All ingredients deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Descontar ingredientes del inventario (cuando se vende)
    deductStock: async (req, res) => {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;
            const result = await ProductIngredient.deductFromInventory(productId, quantity || 1);
            
            if (!result.success) {
                return res.status(400).json(result);
            }
            
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Verificar stock disponible para un producto
    checkStock: async (req, res) => {
        try {
            const { productId } = req.params;
            const { quantity } = req.query;
            const result = await ProductIngredient.checkStock(productId, parseInt(quantity) || 1);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productIngredientController;
