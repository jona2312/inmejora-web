import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const comparisonFeaturesList = [
  { name: "Renders con IA", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Cambio de colores", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Cambio de texturas", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Agregar elementos", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Quitar objetos", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Rediseño de estilos", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Exteriores y jardines", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Foto de referencia", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Cotizador argentino", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Catálogo pinturas argentinas", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Asistente WhatsApp 24/7", explorar: true, basico: true, pro: true, proyecto: true },
  { name: "Descargas 4K", explorar: false, basico: false, pro: true, proyecto: true },
  { name: "Generación prioritaria", explorar: false, basico: false, pro: true, proyecto: true },
  { name: "Pre-proyecto municipio", explorar: false, basico: false, pro: false, proyecto: true },
  { name: "Planos técnicos a escala", explorar: false, basico: false, pro: false, proyecto: true },
  { name: "Videos del hogar", explorar: false, basico: false, pro: false, proyecto: true },
  { name: "Asesor dedicado", explorar: false, basico: false, pro: false, proyecto: true },
  { name: "Cotización real de obra", explorar: false, basico: false, pro: false, proyecto: true }
];

const ComparisonTable = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const PlanHeader = ({ title, color }) => (
    <th className="px-4 py-4 text-center font-bold text-sm sm:text-base border-b border-white/10 bg-[#141414]/50 sticky top-0 z-10" style={{ color }}>
      {title}
    </th>
  );

  const renderIcon = (value) => {
    if (value) return <Check className="w-5 h-5 mx-auto text-green-500" />;
    return <X className="w-5 h-5 mx-auto text-gray-600" />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex justify-center mb-8">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="bg-[#141414] border-white/20 text-white hover:bg-white/5 hover:border-[#FCB048] transition-all"
        >
          {isExpanded ? (
            <>Ocultar comparación detallada <ChevronUp className="ml-2 w-4 h-4" /></>
          ) : (
            <>Ver comparación detallada <ChevronDown className="ml-2 w-4 h-4" /></>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 1 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-x-auto shadow-2xl">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="px-6 py-4 border-b border-white/10 bg-[#141414]/50 text-gray-400 font-medium sticky top-0 left-0 z-20">
                      Características
                    </th>
                    <PlanHeader title="Explorar" color="#6B7280" />
                    <PlanHeader title="Básico" color="#10B981" />
                    <PlanHeader title="Pro" color="#3B82F6" />
                    <PlanHeader title="Mi Proyecto" color="#F59E0B" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors bg-white/5">
                    <td className="px-6 py-4 text-sm font-bold sticky left-0 bg-[#1a1a1a] z-10 border-r border-white/5 text-white">
                      Precio
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-gray-300">Gratis</td>
                    <td className="px-4 py-4 text-center font-bold text-white">$8.000 /mes</td>
                    <td className="px-4 py-4 text-center font-bold text-[#3B82F6] bg-blue-500/5">$16.000 /mes</td>
                    <td className="px-4 py-4 text-center font-bold text-[#F59E0B] bg-amber-500/5">$550.000</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors bg-white/5 border-b-2 border-white/10">
                    <td className="px-6 py-4 text-sm font-bold sticky left-0 bg-[#1a1a1a] z-10 border-r border-white/5 text-white">
                      Renders por mes
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-gray-300">3</td>
                    <td className="px-4 py-4 text-center font-bold text-white">10</td>
                    <td className="px-4 py-4 text-center font-bold text-[#3B82F6] bg-blue-500/5">40</td>
                    <td className="px-4 py-4 text-center font-bold text-[#F59E0B] bg-amber-500/5">Ilimitados</td>
                  </tr>

                  {comparisonFeaturesList.map((feature, idx) => {
                    const isExclusive = idx >= 13;
                    return (
                      <tr key={idx} className={`hover:bg-white/5 transition-colors ${isExclusive ? 'bg-[#F59E0B]/5' : ''}`}>
                        <td className="px-6 py-4 text-sm font-medium sticky left-0 bg-[#141414] z-10 border-r border-white/5 flex items-center gap-2">
                          <span className={isExclusive ? 'text-[#F59E0B]' : 'text-gray-300'}>{feature.name}</span>
                          {isExclusive && <span className="text-[10px] bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded-full whitespace-nowrap">Exclusivo</span>}
                        </td>
                        <td className="px-4 py-4 text-center">{renderIcon(feature.explorar)}</td>
                        <td className="px-4 py-4 text-center">{renderIcon(feature.basico)}</td>
                        <td className="px-4 py-4 text-center bg-blue-500/5">{renderIcon(feature.pro)}</td>
                        <td className="px-4 py-4 text-center bg-amber-500/5">{renderIcon(feature.proyecto)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComparisonTable;