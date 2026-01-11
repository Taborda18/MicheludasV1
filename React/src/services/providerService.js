import api from './api';

export const createProvider = async (providerData) => {
  return await api.post('/providers', providerData);
};