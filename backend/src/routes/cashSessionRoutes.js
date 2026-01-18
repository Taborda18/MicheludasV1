const express = require('express');
const router = express.Router();
const cashSessionController = require('../controllers/cashSessionController');

// Obtener todas las sesiones de caja
router.get('/', cashSessionController.getAll);

// Obtener sesiones abiertas por usuario
router.get('/open/:userId', cashSessionController.getOpenByUser);

// Obtener resumen de sesión (debe ir antes de /:id para evitar conflictos)
router.get('/:id/summary', cashSessionController.getSummary);

// Obtener sesión por ID
router.get('/:id', cashSessionController.getById);

// Abrir sesión
router.post('/open', cashSessionController.openSession);

// Cerrar sesión
router.patch('/:id/close', cashSessionController.closeSession);

module.exports = router;