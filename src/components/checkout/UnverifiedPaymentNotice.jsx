import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UnverifiedPaymentNotice = ({ showPlans = false, showProviderHelp = false }) => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 font-sans">
      <section aria-labelledby="payment-status-title" className="max-w-md w-full bg-[#1a1a1a] border border-[#333] rounded-3xl p-8 shadow-2xl text-center">
        <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle aria-hidden="true" className="w-10 h-10 text-amber-400" />
        </div>
        <h1 id="payment-status-title" className="text-3xl font-bold text-white mb-4">Estado del pago no verificado</h1>
        <p className="text-gray-300 mb-6">
          Esta página no verifica si hubo un cargo ni si un pago fue aprobado, rechazado o está pendiente.
        </p>
        <div className="bg-[#222] rounded-xl p-5 mb-6 text-left text-sm text-gray-300 space-y-3">
          <p>El enlace de retorno no confirma la activación de un plan, la acreditación de créditos ni el envío de un comprobante.</p>
          <p>Si realizaste un pago, revisá el estado y el comprobante en tu cuenta del proveedor de pago. Si necesitás ayuda, contactá a soporte.</p>
          <p>No repitas el pago sólo por este mensaje.</p>
        </div>
        <div className="space-y-3">
          <Button onClick={() => navigate('/portal/dashboard')} className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg">
            Ir al Dashboard <ArrowRight aria-hidden="true" className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" onClick={() => navigate('/contacto')} className="w-full border-[#444] text-white hover:bg-[#333]">
            Contactar Soporte
          </Button>
          {showPlans && (
            <Button variant="outline" onClick={() => navigate('/planes')} className="w-full border-[#444] text-white hover:bg-[#333]">
              Ver Planes
            </Button>
          )}
          {showProviderHelp && (
            <a href="https://www.mercadopago.com.ar/ayuda" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-gray-300 underline hover:text-white">
              Ayuda de Mercado Pago <ExternalLink aria-hidden="true" className="w-4 h-4" />
            </a>
          )}
          <Button variant="ghost" onClick={() => navigate('/')} className="w-full text-gray-400 hover:text-white">
            Volver al Inicio
          </Button>
        </div>
      </section>
    </main>
  );
};

export default UnverifiedPaymentNotice;
