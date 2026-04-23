import { apiCall } from '@/lib/apiClient';

export const pagosAPI = {
  getHistory: async (params = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    const query = searchParams ? `?${searchParams}` : '';
    return await apiCall(`/api/horizon/client/pagos${query}`, 'GET');
  }
};