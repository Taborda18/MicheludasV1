const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGate = require('../middleware/roleGate');

const ADMIN = [1];

// Rutas de usuarios
router.post('/login', userController.login);
router.get('/', authMiddleware.verifyToken, roleGate(ADMIN), userController.getAllUsers);
router.get('/:id', authMiddleware.verifyToken, roleGate(ADMIN), userController.getUserById);
router.post('/', authMiddleware.verifyToken, roleGate(ADMIN), userController.createUser);
router.put('/:id', authMiddleware.verifyToken, roleGate(ADMIN), userController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, roleGate(ADMIN), userController.deleteUser);

module.exports = router;
