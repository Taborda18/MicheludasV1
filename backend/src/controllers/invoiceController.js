const Invoice = require('../models/Invoice');

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
            const newInvoice = await Invoice.create(req.body);
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
