import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pricingPlans } from '@/data/pricingData';
import PricingCard from './PricingCard';
import { useAuth } from '@/contexts/InmejoraAuthContext';

const PricingPlans = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useAuth();
  
  // Use backend plan identification logic if available, else default to explorar
  const currentPlanId = typeof user?.plan_id === 'object' ? user?.plan_id?.id || 'explorar' : user?.plan_id || 'explorar';

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header & Toggle */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
          Planes diseñados para tu <span className="text-[#d4af37]">espacio</span>
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          Transforma tu hogar con inteligencia artificial. Empieza gratis o elige un plan profesional para más créditos y mejores resoluciones.
        </p>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>
            Mensual
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-16 h-8 rounded-full bg-[#1a1a1a] p-1 transition-colors border border-[#444] hover:border-[#d4af37]/50 focus:outline-none"
          >
            <motion.div
              layout
              className="w-6 h-6 rounded-full bg-[#d4af37] shadow-md"
              animate={{ x: isAnnual ? 32 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
            Anual
            <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30">
              Ahorra 14%
            </span>
          </span>
        </div>
      </div>

      {/* Plans Grid: 1 col on mobile, 2 on tablet, up to 4 on lg */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-[1400px] mx-auto">
        {pricingPlans.map((plan) => {
          const planProductId = typeof plan.productId === 'object' && plan.productId !== null
            ? (isAnnual ? plan.productId.annual : plan.productId.monthly)
            : plan.productId || plan.id;

          return (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              isAnnual={isAnnual}
              isCurrentPlan={currentPlanId === planProductId || currentPlanId === plan.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PricingPlans;