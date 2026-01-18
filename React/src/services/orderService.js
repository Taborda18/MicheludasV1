import api from './api';

export const orderService = {
    getAllSessions: async () => {
        const response = await api.get('/sessions');
        return response.data;
    },

    getActiveSessions: async () => {
        const response = await api.get('/sessions/active');
        return response.data;
    },

    getSessionById: async (id) => {
        const response = await api.get(`/sessions/${id}`);
        return response.data;
    },

    getSessionByTable: async (tableIdentifier) => {
        const response = await api.get(`/sessions/table/${tableIdentifier}`);
        return response.data;
    },

    createSession: async (sessionData) => {
        const response = await api.post('/sessions', sessionData);
        return response.data;
    },

    updateSessionStatus: async (id, status) => {
        const response = await api.patch(`/sessions/${id}/status`, { status });
        return response.data;
    },

    // Tickets
    getTicketsBySession: async (sessionId) => {
        const response = await api.get(`/tickets/session/${sessionId}`);
        return response.data;
    },

    getPendingTickets: async () => {
        const response = await api.get('/tickets?status=pending');
        return response.data;
    },

    getSessionsWithPendingTickets: async () => {
        const response = await api.get('/sessions/with-pending-tickets');
        return response.data;
    },

    createTicket: async (ticketData) => {
        const response = await api.post('/tickets', ticketData);
        return response.data;
    },

    updateTicketStatus: async (ticketId, status) => {
        const response = await api.patch(`/tickets/${ticketId}/status`, { status });
        return response.data;
    },

    addTicketDetail: async (detailData) => {
        const response = await api.post('/ticket-details', detailData);
        return response.data;
    },

    // Ticket Details
    updateTicketDetailQuantity: async (detailId, quantity) => {
        const response = await api.patch(`/ticket-details/${detailId}/quantity`, { quantity });
        return response.data;
    },

    deleteTicketDetail: async (detailId) => {
        const response = await api.delete(`/ticket-details/${detailId}`);
        return response.data;
    }
};

