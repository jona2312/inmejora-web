import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    // MercadoPago appends status, payment_id, preference_id etc. to the return URL
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('payment_id');
    const status = params.get('status');
    const preferenceId = params.get('preference_id');
    
    // Check if it's a valid successful return
    if (status !== 'approved' && !paymentId) {
      navigate('/portal');
      return;
    }

    setDetails({
      paymentId: paymentId || 'PROCESADO',
      preferenceId: preferenceId || '-',
      date: new Date().toLocaleDateString('es-AR')
    });
  }, [location, navigate]);

  if (!details) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-[#333] rounded-3xl p-8 shadow-2xl text-center">
        
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-400 mb-8">
          Tu pago ha sido procesado correctamente por Mercado Pago. Tu plan ha sido activado.
        </p>

        <div className="bg-[#222] rounded-xl p-5 mb-8 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">ID de Transacción</span>
            <span className="text-white font-mono">{details.paymentId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Fecha</span>
            <span className="text-white">{details.date}</span>
          </div>
          <div className="border-t border-[#444] my-2 pt-2"></div>
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Los créditos y beneficios ya están disponibles en tu cuenta.</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Te enviamos un comprobante a tu correo electrónico.
        </p>

        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/portal/dashboard')} 
            className="w-full bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold py-6 text-lg transition-colors"
          >
            Ir al Dashboard <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-[#444] text-white hover:bg-[#333]"
            >
              Volver al Inicio
            </Button>
            <Button 
              variant="outline" 
              className="border-[#444] text-white hover:bg-[#333]"
            >
              <Download className="w-4 h-4 mr-2" /> Recibo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;