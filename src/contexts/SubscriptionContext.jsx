import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserSubscription = useCallback(async () => {
    if (!user?.id) {
      setCurrentSubscription(null);
      setCredits(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Mock fetch subscription
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockSub = { id: 'sub-123', plan: 'free', status: 'active' };
      setCurrentSubscription(mockSub);
      setCredits({ credits_remaining: 3, credits_total: 3, credits_used: 0 });
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deductCredit = async (amount = 1) => {
    if (!currentSubscription || !credits) return false;
    
    if (currentSubscription.plan === 'mi_proyecto' && currentSubscription.project_status !== 'finalizado') {
        return true;
    }

    if (credits.credits_remaining < amount) return false;

    try {
      // Mock deduction
      await new Promise(resolve => setTimeout(resolve, 300));
      const newRemaining = credits.credits_remaining - amount;
      const newUsed = credits.credits_used + amount;
      
      setCredits(prev => ({ ...prev, credits_remaining: newRemaining, credits_used: newUsed }));
      return true;
    } catch (error) {
      console.error('Error deducting credit:', error);
    }
    return false;
  };

  const resetMonthlyCredits = async () => {
     if (!currentSubscription) return;
     await fetchUserSubscription(); 
  };

  const finalizeMiProyecto = async () => {
    if (!currentSubscription || currentSubscription.plan !== 'mi_proyecto') return;
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        await fetchUserSubscription();
    } catch (e) {
        console.error("Error finalizing mi_proyecto", e);
    }
  };

  const finalizeProject = finalizeMiProyecto;

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserSubscription();
    } else {
      setCurrentSubscription(null);
      setCredits(null);
      setLoading(false);
    }
  }, [isAuthenticated, fetchUserSubscription]);

  const planColors = {
      'free': '#6B7280',
      'basico': '#10B981',
      'pro_mensual': '#3B82F6',
      'pro_anual': '#8B5CF6',
      'mi_proyecto': '#F59E0B'
  };

  const isEligibleForRender = useMemo(() => {
      if (!currentSubscription) return false;
      if (currentSubscription.plan === 'mi_proyecto' && currentSubscription.project_status === 'finalizado') return false;
      if (currentSubscription.plan !== 'mi_proyecto' && currentSubscription.status !== 'active') return false;
      if (currentSubscription.plan !== 'mi_proyecto' && (credits?.credits_remaining || 0) <= 0) return false;
      return true;
  }, [currentSubscription, credits]);

  const value = {
    currentSubscription,
    creditsRemaining: credits?.credits_remaining || 0,
    creditsTotal: credits?.credits_total || 0,
    creditsUsed: credits?.credits_used || 0,
    isEligibleForRender,
    planColor: planColors[currentSubscription?.plan || 'free'],
    renewalDate: currentSubscription?.period_end,
    loading,
    error: null,
    fetchUserSubscription,
    deductCredit,
    resetMonthlyCredits,
    finalizeProject,
    finalizeMiProyecto
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};