const express = require('express');
const router = express.Router();
const productIngredientController = require('../controllers/productIngredientController');

// Rutas de ingredientes de productos
router.get('/', productIngredientController.getAllIngredients);
router.get('/product/:productId', productIngredientController.getIngredientsByProduct);
router.get('/product/:productId/check-stock', productIngredientController.checkStock);
router.get('/:id', productIngredientController.getIngredientById);
router.post('/', productIngredientController.createIngredient);
router.post('/product/:productId/deduct', productIngredientController.deductStock);
router.put('/:id', productIngredientController.updateIngredient);
router.delete('/:id', productIngredientController.deleteIngredient);
router.delete('/product/:productId', productIngredientController.deleteByProduct);

module.exports = router;
