const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rutas de productos
router.get('/', productController.getAllProducts);
router.get('/active', productController.getActiveProducts);
router.get('/available-inventory', productController.getAvailableInventory);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.post('/from-inventory/:inventoryId', productController.createFromInventory);
router.put('/:id', productController.updateProduct);
router.patch('/:id/toggle', productController.toggleProductActive);
router.delete('/:id', productController.deleteProduct);

module.exports = router;