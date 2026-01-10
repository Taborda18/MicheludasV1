const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Rutas de tickets
router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.get('/:id/details', ticketController.getTicketWithDetails);
router.get('/session/:sessionId', ticketController.getTicketsBySession);
router.post('/', ticketController.createTicket);
router.patch('/:id/status', ticketController.updateTicketStatus);
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
