import { supabase } from '@/lib/customSupabaseClient';

export const dashboardAPI = {
  getStats: async () => {
    try {
      const userStr = localStorage.getItem('inmejora_user');
      if (!userStr) throw new Error("No user found");
      const user = JSON.parse(userStr);
      
      const { data: subs } = await supabase
        .from('client_subscriptions')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const sub = subs?.[0];
      
      let credits = [];
      if (sub) {
        const { data: creds } = await supabase
          .from('client_credits')
          .select('*')
          .eq('subscription_id', sub.id);
        credits = creds || [];
      }

      return {
        stats: { totalRenders: credits.length, completedRenders: credits.length, pendingRenders: 0, totalBudgets: 0 },
        credits: credits.length > 0 ? credits[0].credits_remaining : 0,
        creditsMonthly: 0,
        creditsBonus: 0,
        creditsCap: credits.length > 0 ? credits[0].credits_total : 5,
        renders: credits,
        budgets: [],
        plan: { name: sub?.plan || 'Explorar' }
      };
    } catch (error) {
      console.error(error);
      return {
        stats: { totalRenders: 0, completedRenders: 0, pendingRenders: 0, totalBudgets: 0 },
        credits: 0,
        creditsCap: 5,
        renders: [],
        budgets: [],
        plan: { name: 'Explorar' }
      };
    }
  },
  getPlans: async () => {
    const { data } = await supabase.from('plans').select('*');
    return data || [];
  },
  health: async () => {
    return { status: 'ok' };
  }
};