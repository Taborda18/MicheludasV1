const CashSession = require('../models/CashSession');
const { getIO } = require('../utils/socket');

const cashSessionController = {
    getAll: async (req, res) => {
        try {
            const sessions = await CashSession.findAll();
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const session = await CashSession.findById(req.params.id);
            if (!session) return res.status(404).json({ message: 'Cash session not found' });
            res.json(session);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener sesiones de caja abiertas de forma global (no por usuario)
    getOpenGlobal: async (req, res) => {
        try {
            const sessions = await CashSession.findOpen();
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getOpenByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const sessions = await CashSession.findOpenByUser(userId);
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getSummary: async (req, res) => {
        try {
            const { id } = req.params;
            const session = await CashSession.findById(id);
            if (!session) {
                return res.status(404).json({ message: 'Cash session not found' });
            }

            const cashSales = await CashSession.computeTotalExpected(id);
            const totalExpected = parseFloat(session.opening_balance) + parseFloat(cashSales || 0);

            res.json({
                opening_balance: parseFloat(session.opening_balance),
                cash_sales: parseFloat(cashSales || 0),
                total_expected: totalExpected
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    openSession: async (req, res) => {
        try {
            const { user_id, opening_balance } = req.body;
            if (!user_id || opening_balance === undefined) {
                return res.status(400).json({ message: 'user_id and opening_balance are required' });
            }
            // Evitar múltiples sesiones abiertas: la sesión de caja es general
            const alreadyOpen = await CashSession.findOpen();
            if (alreadyOpen && alreadyOpen.length > 0) {
                return res.status(409).json({ message: 'Ya existe una sesión de caja abierta' });
            }
            const session = await CashSession.create({ user_id, opening_balance });
            try { getIO().emit('cashSession:changed', { action: 'opened', session_id: session.id }); } catch {}
            res.status(201).json(session);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    closeSession: async (req, res) => {
        try {
            const { closing_balance, total_expected } = req.body;
            if (closing_balance === undefined) {
                return res.status(400).json({ message: 'closing_balance is required' });
            }
            const session = await CashSession.close(req.params.id, closing_balance, total_expected);
            if (!session) return res.status(404).json({ message: 'Cash session not found' });
            try { getIO().emit('cashSession:changed', { action: 'closed', session_id: session.id }); } catch {}
            res.json(session);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = cashSessionController;