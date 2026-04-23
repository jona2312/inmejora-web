import React from 'react';
import { Check } from 'lucide-react';

const FeaturesList = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <ul className="space-y-3 mb-8 flex-grow">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm group">
          <div className="mt-0.5 p-0.5 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors">
            <Check className="h-3.5 w-3.5 text-[#D4AF37] flex-shrink-0" />
          </div>
          <span className="leading-tight">{feature}</span>
        </li>
      ))}
    </ul>
  );
};

export default FeaturesList;