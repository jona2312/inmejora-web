import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlanSection = ({ plan }) => {
  const planName = typeof plan === 'object' && plan !== null ? plan.name || 'Gratuito' : String(plan || 'Gratuito');
  const isPro = planName.toLowerCase().includes('pro');

  return (
    <Card className={`border-gray-800 h-full relative overflow-hidden ${isPro ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f]' : 'bg-[#141414]'}`}>
      {isPro && (
        <div className="absolute top-0 right-0 p-3">
          <div className="bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 rounded">PRO</div>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">Mi Plan Actual</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <Zap className={isPro ? "text-[#D4AF37]" : "text-gray-400"} size={24} />
          <h3 className="text-2xl font-bold text-white">{planName}</h3>
        </div>

        <div className="space-y-3 mb-6 flex-grow">
          {isPro ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-[#D4AF37]" /> <span>Renders prioritarios</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-[#D4AF37]" /> <span>Soporte dedicado</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-[#D4AF37]" /> <span>Acceso anticipado a features</span>
              </div>
            </>
          ) : (
             <>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Check className="w-4 h-4 text-gray-500" /> <span>Renders básicos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Check className="w-4 h-4 text-gray-500" /> <span>Acceso a comunidad</span>
              </div>
            </>
          )}
        </div>

        <Link to="/precios" className="mt-auto block">
          <Button className="w-full bg-[#1a1a1a] hover:bg-[#252525] border border-gray-700 text-white group">
            {isPro ? 'Gestionar Plan' : 'Mejorar Plan'} 
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PlanSection;