import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCcw, ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CheckoutErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const status = params.get('status') || 'rechazado';

  const getErrorMessage = () => {
    switch(status) {
      case 'rejected': return "El pago fue rechazado por la tarjeta o Mercado Pago. Verifica los fondos o intenta con otro medio de pago.";
      case 'null': return "El proceso de pago fue cancelado o incompleto.";
      case 'timeout': return "El tiempo de espera se agotó.";
      default: return "No pudimos procesar tu pago. Por favor, intenta nuevamente.";
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-red-900/50 rounded-3xl p-8 shadow-2xl text-center">
        
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Pago Rechazado</h1>
        <p className="text-gray-400 mb-6">Hubo un problema al procesar tu pago con Mercado Pago.</p>

        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-8 text-left">
          <p className="text-red-400 text-sm font-medium">{getErrorMessage()}</p>
          <p className="text-gray-500 text-xs mt-3">
            Tranquilo, no se han realizado cargos en tu cuenta bancaria ni se han emitido facturas.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/planes')} 
            className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg transition-colors"
          >
            <RefreshCcw className="w-5 h-5 mr-2" /> Intentar de Nuevo
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/contacto')}
            className="w-full border-[#444] text-white hover:bg-[#333]"
          >
            <MessageCircle className="w-4 h-4 mr-2" /> Contactar Soporte
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => navigate('/portal/dashboard')}
            className="w-full text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Portal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutErrorPage;