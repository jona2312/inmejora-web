import React from 'react';
import { Badge } from '@/components/ui/badge';

const PricingDisplay = ({ priceString, billingPeriod, savingsText }) => {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <div className="flex items-baseline flex-wrap gap-2">
        <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight">
          {priceString}
        </span>
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-gray-400 text-sm font-medium">
            {billingPeriod}
        </span>
        
        {savingsText && (
          <p className="text-xs text-[#D4AF37] font-medium mt-1">
            {savingsText}
          </p>
        )}
      </div>
    </div>
  );
};

export default PricingDisplay;