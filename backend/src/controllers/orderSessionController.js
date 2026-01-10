const OrderSession = require('../models/OrderSession');

const orderSessionController = {
    // Obtener todas las sesiones
    getAllSessions: async (req, res) => {
        try {
            const sessions = await OrderSession.findAll();
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener solo sesiones activas
    getActiveSessions: async (req, res) => {
        try {
            const sessions = await OrderSession.findActive();
            res.json(sessions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener sesión por ID
    getSessionById: async (req, res) => {
        try {
            const session = await OrderSession.findById(req.params.id);
            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }
            res.json(session);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener sesión por mesa
    getSessionByTable: async (req, res) => {
        try {
            const session = await OrderSession.findByTableIdentifier(req.params.tableIdentifier);
            if (!session) {
                return res.status(404).json({ message: 'No active session for this table' });
            }
            res.json(session);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear nueva sesión
    createSession: async (req, res) => {
        try {
            const newSession = await OrderSession.create(req.body);
            res.status(201).json(newSession);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar sesión
    updateSession: async (req, res) => {
        try {
            const updatedSession = await OrderSession.update(req.params.id, req.body);
            if (!updatedSession) {
                return res.status(404).json({ message: 'Session not found' });
            }
            res.json(updatedSession);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar estado de sesión
    updateSessionStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const updatedSession = await OrderSession.updateStatus(req.params.id, status);
            if (!updatedSession) {
                return res.status(404).json({ message: 'Session not found' });
            }
            res.json(updatedSession);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar sesión
    deleteSession: async (req, res) => {
        try {
            await OrderSession.delete(req.params.id);
            res.json({ message: 'Session deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = orderSessionController;
