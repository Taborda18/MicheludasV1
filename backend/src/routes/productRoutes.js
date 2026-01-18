const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGate = require('../middleware/roleGate');

const ALL_ROLES = [1, 2, 3];
const ADMIN_CAJA = [1, 2];

// Rutas de productos
router.get('/', authMiddleware.verifyToken, roleGate(ALL_ROLES), productController.getAllProducts);
router.get('/active', authMiddleware.verifyToken, roleGate(ALL_ROLES), productController.getActiveProducts);
router.get('/available-inventory', authMiddleware.verifyToken, roleGate(ALL_ROLES), productController.getAvailableInventory);
router.get('/:id', authMiddleware.verifyToken, roleGate(ALL_ROLES), productController.getProductById);
router.post('/', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), productController.createProduct);
router.post('/from-inventory/:inventoryId', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), productController.createFromInventory);
router.put('/:id', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), productController.updateProduct);
router.patch('/:id/toggle', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), productController.toggleProductActive);
router.delete('/:id', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), productController.deleteProduct);

module.exports = router;