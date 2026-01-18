const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGate = require('../middleware/roleGate');

const ALL_ROLES = [1, 2, 3];
const ADMIN_CAJA = [1, 2];

// Rutas de tickets
router.get('/', authMiddleware.verifyToken, roleGate(ALL_ROLES), ticketController.getAllTickets);
router.get('/:id', authMiddleware.verifyToken, roleGate(ALL_ROLES), ticketController.getTicketById);
router.get('/:id/details', authMiddleware.verifyToken, roleGate(ALL_ROLES), ticketController.getTicketWithDetails);
router.get('/session/:sessionId', authMiddleware.verifyToken, roleGate(ALL_ROLES), ticketController.getTicketsBySession);
router.post('/', authMiddleware.verifyToken, roleGate(ALL_ROLES), ticketController.createTicket);
router.patch('/:id/status', authMiddleware.verifyToken, roleGate(ALL_ROLES), ticketController.updateTicketStatus);
router.delete('/:id', authMiddleware.verifyToken, roleGate(ADMIN_CAJA), ticketController.deleteTicket);

module.exports = router;
