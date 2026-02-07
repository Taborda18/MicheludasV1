const Ticket = require('../models/Ticket');
const TicketDetail = require('../models/TicketDetail');
const Inventory = require('../models/Inventory');
const ProductIngredient = require('../models/ProductIngredient');
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

            // Si se está aprobando, validar stock primero
            if (status === 'Approved') {
                const ticketDetails = await TicketDetail.findByTicket(ticketId);
                
                // Validar stock de cada producto
                for (const detail of ticketDetails) {
                    const ingredients = await ProductIngredient.findByProductId(detail.product_id);

                    if (!ingredients || ingredients.length === 0) {
                        // Producto directo: validar stock del inventario por product_id
                        const inventoryItem = await Inventory.findById(detail.product_id);
                        if (!inventoryItem) {
                            return res.status(400).json({
                                error: 'Stock insuficiente',
                                message: 'El producto no tiene inventario asociado',
                                ingredient: 'Inventario no encontrado',
                                available: 0,
                                required: detail.quantity
                            });
                        }

                        if (inventoryItem.stock < detail.quantity) {
                            return res.status(400).json({
                                error: 'Stock insuficiente',
                                message: `No hay suficiente "${inventoryItem.name}". Disponible: ${inventoryItem.stock}, Requerido: ${detail.quantity}`,
                                ingredient: inventoryItem.name,
                                available: inventoryItem.stock,
                                required: detail.quantity
                            });
                        }
                    } else {
                        // Producto con receta: validar ingredientes
                        const stockCheck = await ProductIngredient.checkStock(detail.product_id, detail.quantity);

                        if (!stockCheck.hasStock) {
                            return res.status(400).json({
                                error: 'Stock insuficiente',
                                message: stockCheck.insufficientStock[0].message,
                                ingredient: stockCheck.insufficientStock[0].inventory_name,
                                available: stockCheck.insufficientStock[0].available,
                                required: stockCheck.insufficientStock[0].required
                            });
                        }
                    }
                }

                // Si pasa la validación, descontar inventario
                for (const detail of ticketDetails) {
                    const ingredients = await ProductIngredient.findByProductId(detail.product_id);

                    if (!ingredients || ingredients.length === 0) {
                        await Inventory.updateStock(detail.product_id, -detail.quantity);
                    } else {
                        const deduction = await ProductIngredient.deductFromInventory(detail.product_id, detail.quantity);
                        if (!deduction.success) {
                            return res.status(400).json({
                                error: 'Stock insuficiente',
                                message: deduction.message || 'Stock insuficiente',
                                ingredient: 'Ingrediente insuficiente',
                                available: 0,
                                required: detail.quantity
                            });
                        }
                    }
                }
            }

            // Actualizar estado del ticket
            const updatedTicket = await Ticket.updateStatus(ticketId, status);
            if (!updatedTicket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            try { getIO().emit('ticket:changed', { session_id: updatedTicket.session_id, action: 'status', status }); } catch {}
            res.json({ success: true, ticket: updatedTicket });
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
