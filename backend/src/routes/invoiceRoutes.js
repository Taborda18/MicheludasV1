const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Rutas de facturas
router.get('/', invoiceController.getAllInvoices);
router.get('/report', invoiceController.getSalesReport);
router.get('/:id', invoiceController.getInvoiceById);
router.get('/session/:sessionId', invoiceController.getInvoiceBySession);
router.post('/', invoiceController.createInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
