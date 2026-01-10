const express = require('express');
const router = express.Router();
const orderSessionController = require('../controllers/orderSessionController');

// Rutas de sesiones de orden
router.get('/', orderSessionController.getAllSessions);
router.get('/active', orderSessionController.getActiveSessions);
router.get('/:id', orderSessionController.getSessionById);
router.get('/table/:tableIdentifier', orderSessionController.getSessionByTable);
router.post('/', orderSessionController.createSession);
router.put('/:id', orderSessionController.updateSession);
router.patch('/:id/status', orderSessionController.updateSessionStatus);
router.delete('/:id', orderSessionController.deleteSession);

module.exports = router;
