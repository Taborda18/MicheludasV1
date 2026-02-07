const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Rutas de facturas
router.get('/', invoiceController.getAllInvoices);
router.get('/report', invoiceController.getSalesReport);
router.get('/report/period', invoiceController.getSalesByPeriodReport);
router.get('/:id', invoiceController.getInvoiceById);
router.get('/session/:sessionId', invoiceController.getInvoiceBySession);
router.post('/', invoiceController.createInvoice);
router.post('/generate/invoice', invoiceController.generateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

module.exports = router;
