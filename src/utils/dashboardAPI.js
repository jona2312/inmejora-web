import { supabase } from '@/lib/customSupabaseClient';

// Never derive a render count or credit balance from anonymous subscription
// tables. The canonical Project Core ledger has not been exposed to this UI.
export const dashboardAPI = {
  getStats: async () => {
    const error = new Error('Estadísticas de renders y créditos no disponibles: ledger canónico desactivado.');
    error.code = 'LEDGER_NOT_ACTIVE';
    throw error;
  },
  getPlans: async () => {
    const { data, error } = await supabase.from('plans').select('*');
    if (error) throw error;
    return data || [];
  },
  health: async () => ({ status: 'ok' }),
};
