const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Rutas de inventario
router.get('/', inventoryController.getAllInventory);
router.get('/low-stock', inventoryController.getLowStockItems);
router.get('/:id', inventoryController.getInventoryById);
router.post('/', inventoryController.createInventoryItem);
router.put('/:id', inventoryController.updateInventoryItem);
router.patch('/:id/stock', inventoryController.updateStock);
router.delete('/:id', inventoryController.deleteInventoryItem);

module.exports = router;
