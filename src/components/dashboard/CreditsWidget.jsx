import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Infinity } from 'lucide-react';

const CreditsWidget = () => {
  const { currentSubscription, creditsRemaining, creditsTotal, creditsUsed, planColor, renewalDate, loading } = useSubscription();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="bg-[#141414] border-gray-800 h-full flex items-center justify-center min-h-[250px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FCB048]"></div>
      </Card>
    );
  }

  const planName = typeof currentSubscription === 'object' && currentSubscription !== null 
    ? currentSubscription?.plan || 'free'
    : 'free';
    
  const isMiProyecto = planName === 'mi_proyecto';
  
  const getPlanDisplayName = (p) => {
    switch (p) {
      case 'basico': return 'Básico';
      case 'pro_mensual': return 'Pro Mensual';
      case 'pro_anual': return 'Pro Anual';
      case 'mi_proyecto': return 'Mi Proyecto';
      default: return 'Explorar';
    }
  };

  const displayName = getPlanDisplayName(planName);
  const isFinalizado = currentSubscription?.status === 'expired' || currentSubscription?.status === 'finalizado' || (isMiProyecto && currentSubscription?.project_status === 'finalizado');
  
  const safeCreditsTotal = creditsTotal || 0;
  const safeCreditsUsed = creditsUsed || 0;
  const safeCreditsRemaining = creditsRemaining || 0;
  
  const percentage = safeCreditsTotal > 0 ? Math.min(100, Math.max(0, (safeCreditsUsed / safeCreditsTotal) * 100)) : 0;
  
  // SVG Circle calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let progressColor = planColor || '#6B7280';
  if (!isMiProyecto && safeCreditsRemaining === 0) progressColor = '#ef4444'; // Red if empty

  const getRenewalText = () => {
    if (planName === 'free') return 'No se renueva (Plan Gratis)';
    if (isMiProyecto) return currentSubscription?.project_status === 'finalizado' ? 'Proyecto Finalizado' : 'Proyecto en curso';
    if (!renewalDate) return 'Sin fecha de renovación';
    const date = new Date(renewalDate);
    return `Se renueva el ${date.toLocaleDateString('es-AR')}`;
  };

  return (
    <Card className="bg-[#141414] border-gray-800 h-full relative overflow-hidden flex flex-col">
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-gray-400">Estado de Plan</CardTitle>
        <span 
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: `${planColor || '#FCB048'}20`, color: planColor || '#FCB048', border: `1px solid ${planColor || '#FCB048'}50` }}
        >
          {displayName}
        </span>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center justify-center pt-6 flex-grow">
        
        {isFinalizado ? (
          <div className="text-center w-full">
            <h3 className="text-red-400 font-bold mb-2">
                {isMiProyecto ? 'Proyecto Finalizado' : 'Suscripción Expirada'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
                {isMiProyecto ? 'Este proyecto ha concluido.' : 'Renueva tu plan para seguir renderizando.'}
            </p>
            <Button onClick={() => navigate('/precios')} className="bg-[#FCB048] hover:bg-[#e09b3d] text-black w-full">
              {isMiProyecto ? 'Nuevo Proyecto' : 'Renovar Plan'}
            </Button>
          </div>
        ) : (
          <>
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#2a2a2a"
                  strokeWidth="10"
                  fill="transparent"
                />
                {!isMiProyecto && (
                    <motion.circle
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke={progressColor}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeLinecap="round"
                    />
                )}
                {isMiProyecto && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke={progressColor}
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeLinecap="round"
                      strokeDashoffset="0"
                    />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {isMiProyecto ? (
                    <Infinity className="w-16 h-16 text-white" />
                ) : (
                    <span className="text-4xl font-black text-white">{safeCreditsRemaining}</span>
                )}
                <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">
                    {isMiProyecto ? 'Ilimitados' : 'Disponibles'}
                </span>
              </div>
            </div>

            <div className="text-center w-full">
              {!isMiProyecto && (
                  <>
                    <p className="text-sm text-gray-300 font-medium mb-1">
                        {safeCreditsUsed} renders usados / {safeCreditsTotal} renders totales
                    </p>
                    <p className="text-xs text-[#FCB048] font-bold mb-4">
                        {Math.round(percentage)}% usado
                    </p>
                  </>
              )}
              {isMiProyecto && (
                  <p className="text-sm text-[#FCB048] font-bold mb-5">
                      Renders ilimitados activados
                  </p>
              )}
              
              <div className="h-px w-full bg-gray-800 my-4" />
              
              <p className="text-xs text-gray-500 mb-5">
                {getRenewalText()}
              </p>

              <div className="flex gap-2 w-full">
                  {(!isMiProyecto && (safeCreditsRemaining <= 0 || planName === 'free')) ? (
                    <Button 
                      onClick={() => navigate('/precios')} 
                      className="w-full bg-[#FCB048] text-black hover:bg-[#e09b3d] font-bold shadow-[0_0_15px_rgba(252,176,72,0.3)] transition-all"
                    >
                      {planName === 'free' ? 'Mejorar Plan' : 'Recargar Renders'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => navigate('/precios')} 
                      variant="outline" 
                      className="w-full border-gray-700 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Cambiar Plan
                    </Button>
                  )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditsWidget;