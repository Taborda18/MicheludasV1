import api from './api';

export const cashSessionService = {
    async openSession({ user_id, opening_balance }) {
        const response = await api.post('/cash-sessions/open', { user_id, opening_balance });
        return response.data;
    },

    async getOpenByUser(userId) {
        const response = await api.get(`/cash-sessions/open/${userId}`);
        return response.data;
    },

    async getSessionSummary(sessionId) {
        const response = await api.get(`/cash-sessions/${sessionId}/summary`);
        return response.data;
    },

    async closeSession(sessionId, { closing_balance, total_expected }) {
        const response = await api.patch(`/cash-sessions/${sessionId}/close`, {
            closing_balance,
            total_expected
        });
        return response.data;
    }
};
