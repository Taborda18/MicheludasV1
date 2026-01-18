const express = require('express');
const router = express.Router();
const ticketDetailController = require('../controllers/ticketDetailController');

// Rutas de detalles de tickets
router.get('/ticket/:ticketId', ticketDetailController.getDetailsByTicket);
router.get('/ticket/:ticketId/total', ticketDetailController.getTicketTotal);
router.get('/:id', ticketDetailController.getDetailById);
router.post('/', ticketDetailController.createDetail);
router.put('/:id', ticketDetailController.updateDetail);
router.patch('/:id/quantity', ticketDetailController.updateQuantity);
router.delete('/:id', ticketDetailController.deleteDetail);

module.exports = router;
