const Invoice = require('../models/Invoice');
const { getIO } = require('../utils/socket');

const invoiceController = {
    // Obtener todas las facturas
    getAllInvoices: async (req, res) => {
        try {
            const invoices = await Invoice.findAll();
            res.json(invoices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener factura por ID
    getInvoiceById: async (req, res) => {
        try {
            const invoice = await Invoice.findById(req.params.id);
            if (!invoice) {
                return res.status(404).json({ message: 'Invoice not found' });
            }
            res.json(invoice);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener factura por sesión
    getInvoiceBySession: async (req, res) => {
        try {
            const invoice = await Invoice.findBySession(req.params.sessionId);
            if (!invoice) {
                return res.status(404).json({ message: 'Invoice not found for this session' });
            }
            res.json(invoice);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear nueva factura
    createInvoice: async (req, res) => {
        try {
            const { session_id, cashier_id, total_amount, payment_method, cash_session_id } = req.body;
            const newInvoice = await Invoice.create({
                session_id,
                cashier_id,
                total_amount,
                payment_method,
                cash_session_id
            });
            try { getIO().emit('invoice:created', { session_id: newInvoice.session_id, invoice_id: newInvoice.id }); getIO().emit('orderSession:changed', { action: 'updated' }); } catch {}
            res.status(201).json(newInvoice);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar factura
    deleteInvoice: async (req, res) => {
        try {
            await Invoice.delete(req.params.id);
            res.json({ message: 'Invoice deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear factura y cerrar sesión
    generateInvoice: async (req, res) => {
        try {
            const { session_id, cashier_id, total_amount, payment_method, cash_session_id } = req.body;
            
            if (!session_id || !total_amount) {
                return res.status(400).json({ message: 'session_id and total_amount are required' });
            }

            const invoice = await Invoice.createAndCloseSession({
                session_id,
                cashier_id,
                total_amount,
                payment_method: payment_method || 'cash',
                cash_session_id
            });
            try { 
                getIO().emit('invoice:created', { session_id, invoice_id: invoice?.id });
                getIO().emit('orderSession:changed', { action: 'status', session_id, status: 'Closed' });
            } catch {}
            res.status(201).json(invoice);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener reportes por rango de fechas
    getSalesReport: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                return res.status(400).json({ message: 'Start date and end date are required' });
            }
            const report = await Invoice.getTotalsByDateRange(startDate, endDate);
            res.json(report);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = invoiceController;
