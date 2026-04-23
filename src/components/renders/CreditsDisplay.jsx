import React from 'react';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { Coins } from 'lucide-react';

const CreditsDisplay = () => {
  const { user } = useAuth();
  
  // Assuming user object has credits, fallback to 3 if not present for demo purposes
  const credits = user?.credits ?? 3;
  const cost = 1;
  const hasEnough = credits >= cost;

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-[#d4af37]" />
          <span className="text-white font-medium">Tienes {credits} créditos disponibles</span>
        </div>
        <span className="text-sm text-gray-400">Este render costará {cost} crédito</span>
      </div>
      
      <div className="w-full bg-[#333] rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ${hasEnough ? 'bg-[#d4af37]' : 'bg-red-500'}`}
          style={{ width: `${Math.min(100, (credits / 10) * 100)}%` }}
        ></div>
      </div>
      
      {!hasEnough && (
        <p className="text-red-500 text-sm mt-2">No tienes suficientes créditos para generar este render.</p>
      )}
    </div>
  );
};

export default CreditsDisplay;