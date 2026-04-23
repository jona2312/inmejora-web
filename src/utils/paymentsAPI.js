import apiClient from './apiClient';

export const paymentsAPI = {
  getHistory: async (params = {}) => {
    const response = await apiClient.get('/api/horizon/payments/history', { params });
    return response.data;
  },
  downloadInvoice: async (id) => {
    const response = await apiClient.get(`/api/horizon/payments/${id}/invoice`, { responseType: 'blob' });
    return response.data;
  }
};