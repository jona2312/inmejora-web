import { apiCall } from '@/lib/apiClient';

export const quoterAPI = {
  calculate: async (data) => {
    return await apiCall('/api/horizon/client/cotizar', 'POST', data);
  }
};