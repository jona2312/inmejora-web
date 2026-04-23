import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import StatsCards from '@/components/dashboard/StatsCards';
import RendersSection from '@/components/dashboard/RendersSection';
import BudgetsSection from '@/components/dashboard/BudgetsSection';
import PlanSection from '@/components/dashboard/PlanSection';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { data: subs, error: subErr } = await supabase
        .from('client_subscriptions')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (subErr) throw subErr;

      const sub = subs?.[0];
      let credits = [];

      if (sub) {
        const { data: creds, error: credErr } = await supabase
          .from('client_credits')
          .select('*')
          .eq('subscription_id', sub.id);
        
        if (!credErr) credits = creds || [];
      }

      setDashboardData({
        stats: { totalRenders: credits.length, completedRenders: credits.length, pendingRenders: 0, totalBudgets: 0 },
        credits: credits.length > 0 ? credits[0].credits_remaining : 0,
        creditsCap: credits.length > 0 ? credits[0].credits_total : 5,
        renders: credits,
        budgets: [],
        plan: { name: sub?.plan || 'Explorar' }
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError('No pudimos cargar tu información. Por favor, intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const data = dashboardData || {
    stats: { totalRenders: 0, completedRenders: 0, pendingRenders: 0, totalBudgets: 0 },
    credits: 0,
    creditsCap: 5,
    renders: [],
    budgets: [],
    plan: { name: 'Explorar' }
  };

  const capitalize = (s) => s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : 'Plan';
  const currentPlanNameStr = data.plan?.name || 'Explorar';
  const safeCredits = data.credits;
  const safeCreditsCap = data.creditsCap;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col font-sans selection:bg-[#D4AF37] selection:text-black">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 lg:px-8 py-12 pt-28 max-w-[1400px]">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#333] pb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Bienvenido, <span className="text-[#D4AF37]">{user?.full_name || user?.name || 'Usuario'}</span>
              </h1>
              <Badge className={`bg-[#D4AF37] text-black font-bold hover:bg-[#b5952f] uppercase`}>
                  {capitalize(currentPlanNameStr)}
              </Badge>
            </div>
            <p className="text-gray-400">
              Gestiona tus proyectos, revisa tus renders con IA y controla tu presupuesto desde un solo lugar.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-right hidden md:block mr-4">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Estado de cuenta</p>
                <div className="flex items-center justify-end gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                    <span className="text-sm font-medium text-green-400">Activa</span>
                </div>
             </div>
             <Button 
                onClick={fetchDashboardData} 
                disabled={loading}
                variant="outline" 
                size="icon"
                className="border-[#444] hover:bg-[#333] text-gray-300 rounded-xl"
             >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
             </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && !loading && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-red-400 font-medium">
                  <AlertCircle className="h-6 w-6" />
                  <p>{error}</p>
                </div>
                <Button onClick={fetchDashboardData} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  Reintentar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !dashboardData ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37] mb-4" />
            <p className="text-[#d4af37] font-medium animate-pulse">Obteniendo métricas...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <StatsCards stats={data.stats} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-8">
                 <RendersSection renders={data.renders} />
                 <BudgetsSection budgets={data.budgets} />
              </div>

              <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="h-auto bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-white">Créditos IA</h3>
                    <span className="text-xs bg-[#d4af37]/20 text-[#d4af37] px-2 py-1 rounded font-bold uppercase tracking-wider">
                      {safeCredits}/{safeCreditsCap}
                    </span>
                  </div>
                  <div className="w-full bg-[#222] rounded-full h-3 mb-2 overflow-hidden border border-[#333]">
                    <div 
                      className="bg-gradient-to-r from-[#d4af37] to-[#fde047] h-3 rounded-full shadow-[0_0_10px_#d4af37]" 
                      style={{ width: `${Math.min(100, (safeCredits / (safeCreditsCap || 1)) * 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mb-6">Utiliza tus créditos para generar simulaciones 3D. 1 Crédito = 1 Render.</p>
                  <Button onClick={() => navigate('/portal/renders')} className="w-full bg-[#333] text-white hover:bg-[#444] border border-[#555]">Ir al Generador</Button>
                </div>
                
                <div className="h-auto">
                   <PlanSection plan={{name: capitalize(currentPlanNameStr)}} />
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;