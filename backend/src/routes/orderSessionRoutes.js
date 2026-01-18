const express = require('express');
const router = express.Router();
const orderSessionController = require('../controllers/orderSessionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGate = require('../middleware/roleGate');

// ADMIN=1, CAJA=2, MESERO=3
const ALL_ROLES = [1, 2, 3];
const ADMIN_CAJA = [1, 2];

// Rutas de sesiones de orden
// IMPORTANTE: Rutas específicas ANTES de rutas con parámetros
router.get('/open', authMiddleware.verifyToken, roleGate(ALL_ROLES), orderSessionController.getOpenSessions);
router.get('/closed', authMiddleware.verifyToken, roleGate(ALL_ROLES), orderSessionController.getClosedSessions);
router.get('/with-pending-tickets', authMiddleware.verifyToken, roleGate(ALL_ROLES), orderSessionController.getSessionsWithPendingTickets);
router.get('/table/:tableIdentifier', authMiddleware.verifyToken, roleGate(ALL_ROLES), orderSessionController.getSessionByTable);
router.get('/', authMiddleware.verifyToken, roleGate(ALL_ROLES), orderSessionController.getAllSessions);
router.get('/:id', authMiddleware.verifyToken, roleGate(ALL_ROLES), orderSessionController.getSessionById);
router.post('/', authMiddleware.verifyToken, roleGate(ALL_ROLES), orderSessionController.createSession);
router.put('/:id', authMiddleware.verifyToken, roleGate(ALL_ROLES), orderSessionController.updateSession);
router.patch('/:id/status', authMiddleware.verifyToken, roleGate(ALL_ROLES), orderSessionController.updateSessionStatus);
router.delete('/:id', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), orderSessionController.deleteSession);

module.exports = router;
