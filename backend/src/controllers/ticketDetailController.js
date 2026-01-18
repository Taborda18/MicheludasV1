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
    },

    // Actualizar solo la cantidad
    updateQuantity: async (req, res) => {
        try {
            const { quantity } = req.body;
            
            if (quantity === undefined || quantity === null) {
                return res.status(400).json({ error: 'Quantity is required' });
            }

            if (quantity < 0) {
                return res.status(400).json({ error: 'Quantity cannot be negative' });
            }

            const updatedDetail = await TicketDetail.updateQuantity(req.params.id, quantity);
            
            if (!updatedDetail) {
                return res.status(404).json({ message: 'Detail not found' });
            }

            // Calcular subtotal
            const subtotal = updatedDetail.quantity * updatedDetail.unit_price_at_sale;
            
            res.json({
                ...updatedDetail,
                subtotal
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ticketDetailController;
