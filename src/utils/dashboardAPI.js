import { supabase } from '@/lib/customSupabaseClient';

export const dashboardAPI = {
  getStats: async () => {
    const error = new Error('Créditos y métricas no disponibles hasta habilitar el servicio canónico.');
    error.code = 'CANONICAL_ACCOUNT_UNAVAILABLE';
    throw error;
  },
  getPlans: async () => {
    const { data } = await supabase.from('plans').select('*');
    return data || [];
  },
  health: async () => {
    return { status: 'ok' };
  }
};