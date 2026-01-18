const Ticket = require('../models/Ticket');
const TicketDetail = require('../models/TicketDetail');
const Inventory = require('../models/Inventory');
const { getIO } = require('../utils/socket');

const ticketController = {
    // Obtener todos los tickets
    getAllTickets: async (req, res) => {
        try {
            const tickets = await Ticket.findAll();
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener ticket por ID
    getTicketById: async (req, res) => {
        try {
            const ticket = await Ticket.findById(req.params.id);
            if (!ticket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener ticket con detalles
    getTicketWithDetails: async (req, res) => {
        try {
            const ticket = await Ticket.getWithDetails(req.params.id);
            if (!ticket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            res.json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener tickets por sesión
    getTicketsBySession: async (req, res) => {
        try {
            const tickets = await Ticket.findBySessionWithDetails(req.params.sessionId);
            res.json(tickets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Crear nuevo ticket
    createTicket: async (req, res) => {
        try {
            const newTicket = await Ticket.create(req.body);
            try { getIO().emit('ticket:changed', { session_id: newTicket.session_id, action: 'created' }); } catch {}
            res.status(201).json(newTicket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar estado del ticket
    updateTicketStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const ticketId = req.params.id;

            // Solo actualizar estado, sin descontar inventario
            // El inventario se descuenta cuando se genera la factura
            const updatedTicket = await Ticket.updateStatus(ticketId, status);
            if (!updatedTicket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            try { getIO().emit('ticket:changed', { session_id: updatedTicket.session_id, action: 'status', status }); } catch {}
            res.json(updatedTicket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar ticket
    deleteTicket: async (req, res) => {
        try {
            const id = req.params.id;
            const existing = await Ticket.findById(id);
            await Ticket.delete(id);
            try { getIO().emit('ticket:changed', { session_id: existing?.session_id, action: 'deleted' }); } catch {}
            res.json({ message: 'Ticket deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ticketController;
