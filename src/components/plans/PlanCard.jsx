import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

const PlanCard = ({ plan, isCurrentPlan, onSelect, loading }) => {
  const isPremium = plan.id === 'pro_monthly' || plan.id === 'pro_annual' || plan.id === 'mi_proyecto';

  return (
    <div className={`bg-[#141414] border rounded-2xl p-6 flex flex-col h-full transition-all duration-300 ${
        isPremium ? 'border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-gray-800 hover:border-gray-700'
    }`}>
      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
      <p className="text-gray-400 mb-6 flex-grow">{plan.description}</p>
      
      <div className="mb-6">
        <span className="text-3xl font-bold text-white">{plan.priceString}</span>
        {plan.billingPeriod && (
          <span className="text-gray-500 ml-2 text-sm">{plan.billingPeriod}</span>
        )}
      </div>
      
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start text-gray-300">
            <Check className="w-5 h-5 text-[#d4af37] mr-3 shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        onClick={() => onSelect(plan)}
        disabled={isCurrentPlan || loading}
        className={`w-full py-6 text-lg font-bold rounded-xl transition-all ${
          isCurrentPlan 
            ? 'bg-[#222] text-gray-400 cursor-not-allowed border border-[#333] hover:bg-[#222]' 
            : 'bg-[#d4af37] hover:bg-[#b5952f] text-black hover:shadow-lg hover:shadow-[#d4af37]/20'
        }`}
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
        {isCurrentPlan && !loading ? 'Plan Actual' : (loading ? 'Procesando...' : 'Comprar Ahora')}
      </Button>
    </div>
  );
};

export default PlanCard;