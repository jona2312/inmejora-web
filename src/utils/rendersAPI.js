import { supabase } from '@/lib/customSupabaseClient';

export const rendersAPI = {
  upload: async (formData) => {
    return { ok: true, url: '' }; // Mock since external API removed
  },
  generate: async (data) => {
    return { ok: true };
  },
  edit: async (data) => {
    return { ok: true };
  },
  list: async (params = {}) => {
    const userStr = localStorage.getItem('inmejora_user');
    if (!userStr) return [];
    const user = JSON.parse(userStr);
    
    const { data: subs } = await supabase
      .from('client_subscriptions')
      .select('id')
      .eq('client_id', user.id)
      .limit(1);

    if (!subs || subs.length === 0) return [];
    
    const { data } = await supabase
      .from('client_credits')
      .select('*')
      .eq('subscription_id', subs[0].id);

    return data || [];
  },
  detail: async (id) => {
    const { data } = await supabase.from('client_credits').select('*').eq('id', id).single();
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase.from('client_credits').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  },
  download: async (id, quality = 'high') => {
    return { url: '' };
  }
};