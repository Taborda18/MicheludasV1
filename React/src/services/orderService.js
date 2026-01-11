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

    createTicket: async (ticketData) => {
        const response = await api.post('/tickets', ticketData);
        return response.data;
    },

    addTicketDetail: async (detailData) => {
        const response = await api.post('/ticket-details', detailData);
        return response.data;
    }
};
