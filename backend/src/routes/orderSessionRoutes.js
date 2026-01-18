const express = require('express');
const router = express.Router();
const orderSessionController = require('../controllers/orderSessionController');

// Rutas de sesiones de orden
// IMPORTANTE: Rutas específicas ANTES de rutas con parámetros
router.get('/open', orderSessionController.getOpenSessions);
router.get('/closed', orderSessionController.getClosedSessions);
router.get('/with-pending-tickets', orderSessionController.getSessionsWithPendingTickets);
router.get('/table/:tableIdentifier', orderSessionController.getSessionByTable);
router.get('/', orderSessionController.getAllSessions);
router.get('/:id', orderSessionController.getSessionById);
router.post('/', orderSessionController.createSession);
router.put('/:id', orderSessionController.updateSession);
router.patch('/:id/status', orderSessionController.updateSessionStatus);
router.delete('/:id', orderSessionController.deleteSession);

module.exports = router;
