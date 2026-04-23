import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PortalCotizaciones = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/portal')} className="mb-6 hover:bg-[#222] text-gray-400 hover:text-white pl-0">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>

        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FileText className="text-[#d4af37]" /> Mis Cotizaciones
        </h1>

        <div className="border border-dashed border-[#333] rounded-xl bg-[#1a1a1a]/50 h-64 flex flex-col items-center justify-center text-center p-6">
          <FileText className="w-12 h-12 text-gray-500 mb-4 opacity-50" />
          <h3 className="text-xl font-medium text-white mb-2">Contenido próximamente</h3>
          <p className="text-gray-400 max-w-md">
            Aquí encontrarás los presupuestos detallados de tus proyectos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalCotizaciones;