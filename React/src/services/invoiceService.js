import api from './api';

export const invoiceService = {
    getAllInvoices: async () => {
        const response = await api.get('/invoices');
        return response.data;
    },

    getInvoiceById: async (id) => {
        const response = await api.get(`/invoices/${id}`);
        return response.data;
    },

    getInvoiceBySession: async (sessionId) => {
        const response = await api.get(`/invoices/session/${sessionId}`);
        return response.data;
    },

    createInvoice: async (invoiceData) => {
        const response = await api.post('/invoices', invoiceData);
        return response.data;
    },

    generateInvoice: async (invoiceData) => {
        const response = await api.post('/invoices/generate/invoice', invoiceData);
        return response.data;
    },

    getSalesReport: async (startDate, endDate) => {
        const response = await api.get('/invoices/report', {
            params: { startDate, endDate }
        });
        return response.data;
    },

    deleteInvoice: async (id) => {
        const response = await api.delete(`/invoices/${id}`);
        return response.data;
    }
};
