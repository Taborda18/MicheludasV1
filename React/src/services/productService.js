import api from './api';

export const productService = {
    getAll: async () => {
        const response = await api.get('/products');
        return response.data;
    },

    getActive: async () => {
        const response = await api.get('/products/active');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    create: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data;
    },

    update: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    toggleActive: async (id) => {
        const response = await api.patch(`/products/${id}/toggle`);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    }
};
