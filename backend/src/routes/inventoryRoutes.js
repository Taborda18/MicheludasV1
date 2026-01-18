const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGate = require('../middleware/roleGate');

const ADMIN_CAJA = [1, 2];

// Rutas de inventario - solo ADMIN y CAJA
router.get('/', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), inventoryController.getAllInventory);
router.get('/low-stock', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), inventoryController.getLowStockItems);
router.get('/:id', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), inventoryController.getInventoryById);
router.post('/', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), inventoryController.createInventoryItem);
router.put('/:id', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), inventoryController.updateInventoryItem);
router.patch('/:id/stock', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), inventoryController.updateStock);
router.delete('/:id', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), inventoryController.deleteInventoryItem);

module.exports = router;
