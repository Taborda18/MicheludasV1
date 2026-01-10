const TicketDetail = require('../models/TicketDetail');

const ticketDetailController = {
    // Obtener detalles por ticket
    getDetailsByTicket: async (req, res) => {
        try {
            const details = await TicketDetail.findByTicket(req.params.ticketId);
            res.json(details);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener detalle por ID
    getDetailById: async (req, res) => {
        try {
            const detail = await TicketDetail.findById(req.params.id);
            if (!detail) {
                return res.status(404).json({ message: 'Detail not found' });
            }
            res.json(detail);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear nuevo detalle
    createDetail: async (req, res) => {
        try {
            const newDetail = await TicketDetail.create(req.body);
            res.status(201).json(newDetail);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar detalle
    updateDetail: async (req, res) => {
        try {
            const updatedDetail = await TicketDetail.update(req.params.id, req.body);
            if (!updatedDetail) {
                return res.status(404).json({ message: 'Detail not found' });
            }
            res.json(updatedDetail);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar detalle
    deleteDetail: async (req, res) => {
        try {
            await TicketDetail.delete(req.params.id);
            res.json({ message: 'Detail deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Calcular total del ticket
    getTicketTotal: async (req, res) => {
        try {
            const total = await TicketDetail.calculateTicketTotal(req.params.ticketId);
            res.json({ total });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ticketDetailController;
