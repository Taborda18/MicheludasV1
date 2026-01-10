import api from './api';

export const inventoryService = {
    getAll: async () => {
        const response = await api.get('/inventory');
        return response.data;
    },

    getLowStock: async (threshold = 10) => {
        const response = await api.get(`/inventory/low-stock?threshold=${threshold}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/inventory/${id}`);
        return response.data;
    },

    create: async (inventoryData) => {
        const response = await api.post('/inventory', inventoryData);
        return response.data;
    },

    update: async (id, inventoryData) => {
        const response = await api.put(`/inventory/${id}`, inventoryData);
        return response.data;
    },

    updateStock: async (id, quantity) => {
        const response = await api.patch(`/inventory/${id}/stock`, { quantity });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/inventory/${id}`);
        return response.data;
    }
};
