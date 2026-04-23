import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CheckoutPendingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get('payment_id') || 'Pendiente de acreditación';

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-[#333] rounded-3xl p-8 shadow-2xl text-center">
        
        <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-500 animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Pago Pendiente</h1>
        <p className="text-gray-400 mb-6">
          Tu pago está siendo procesado por Mercado Pago.
        </p>

        <div className="bg-[#222] rounded-xl p-5 mb-8 text-left">
          <p className="text-sm text-gray-300 mb-4">
            Si pagaste con efectivo (Rapipago, Pago Fácil) o transferencia, la acreditación puede demorar de 1 a 48 horas hábiles.
          </p>
          <div className="flex justify-between text-xs border-t border-[#444] pt-3">
            <span className="text-gray-500">ID de Referencia:</span>
            <span className="text-white font-mono">{paymentId}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Recibirás un email de confirmación y tu plan se activará automáticamente cuando el pago sea aprobado por Mercado Pago.
        </p>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/portal/dashboard')} 
            className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg transition-colors"
          >
            Ir al Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.open('https://www.mercadopago.com.ar/ayuda', '_blank')}
            className="w-full border-[#444] text-white hover:bg-[#333]"
          >
            Ayuda de Mercado Pago <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPendingPage;