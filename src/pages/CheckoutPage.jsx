import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { pricingPlans } from '@/data/pricingData';
import { useMercadoPagoCheckout } from '@/hooks/useMercadoPagoCheckout';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  // Adjusted destructuring to match useMercadoPagoCheckout hook exports
  const { handleSubscribe: processPayment, loadingProductId } = useMercadoPagoCheckout();
  const isProcessing = !!loadingProductId;
  
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dni: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const params = new URLSearchParams(location.search);
    const planId = params.get('plan');
    
    const selectedPlan = pricingPlans.find(p => p.id === planId);
    if (!selectedPlan || selectedPlan.price === '0' || selectedPlan.price === 'A Medida') {
      navigate('/precios');
      return;
    }
    
    setPlan(selectedPlan);
    
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dni: ''
      });
    }
  }, [location, isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    processPayment(plan.id);
  };

  if (!plan) return <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" /></div>;

  // Simulate numeric price for calculation
  const numericPrice = parseInt(plan.price.replace(/\./g, '')) || 0;
  const tax = numericPrice * 0.21;
  const total = numericPrice + tax;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <header className="bg-[#1a1a1a] border-b border-[#333] h-16 flex items-center px-4 md:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/precios')} className="text-gray-400 hover:text-white pl-0">
            <ArrowLeft className="w-5 h-5 mr-2" /> Volver
          </Button>
          <span className="font-bold text-[#d4af37]">Finalizar Compra</span>
          <div className="flex items-center text-green-500 text-sm gap-1">
            <Shield className="w-4 h-4" /> Pago Seguro
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Right/Bottom on Mobile: Order Summary */}
          <div className="lg:col-span-5 lg:order-2 order-1">
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
              
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-[#333]">
                <div>
                  <h3 className="font-bold text-lg text-[#d4af37]">Plan {plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.period ? plan.period.replace('/', 'Suscripción ') : ''}</p>
                </div>
                <p className="font-bold text-lg">${plan.price}</p>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-sm font-medium text-gray-300">Incluye:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-400">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {plan.renders} Créditos para renders
                  </li>
                  {plan.features && plan.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#333]">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>${numericPrice.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>IVA (21%)</span>
                  <span>${tax.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-[#333]">
                  <span>Total a pagar</span>
                  <span>${total.toLocaleString('es-AR')} ARS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Left/Top on Mobile: Payment Form */}
          <div className="lg:col-span-7 lg:order-1 order-2 space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Detalles de Facturación</h1>
              <p className="text-gray-400">Completa tus datos para procesar el pago de forma segura a través de Mercado Pago.</p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-6 bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Nombre completo</Label>
                  <Input 
                    id="name" name="name" required
                    value={formData.name} onChange={handleChange}
                    className="bg-[#222] border-[#444] text-white focus-visible:ring-[#d4af37]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dni" className="text-gray-300">DNI / CUIT</Label>
                  <Input 
                    id="dni" name="dni" required
                    value={formData.dni} onChange={handleChange}
                    className="bg-[#222] border-[#444] text-white focus-visible:ring-[#d4af37]"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input 
                    id="email" name="email" type="email" required
                    value={formData.email} onChange={handleChange} readOnly
                    className="bg-[#222] border-[#444] text-gray-400 focus-visible:ring-0 opacity-70"
                  />
                  <p className="text-xs text-gray-500">El recibo será enviado a esta dirección.</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone" className="text-gray-300">Teléfono</Label>
                  <Input 
                    id="phone" name="phone" type="tel" required
                    value={formData.phone} onChange={handleChange}
                    className="bg-[#222] border-[#444] text-white focus-visible:ring-[#d4af37]"
                  />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#333]">
                <Button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-[#009EE3] hover:bg-[#008CDB] text-white font-bold py-6 text-lg rounded-xl transition-all"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                  {isProcessing ? "Redirigiendo a Mercado Pago..." : "Pagar con Mercado Pago"}
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icono-1024.png" alt="Mercado Pago" className="h-6 object-contain" />
                  <span className="text-xs text-gray-500">Procesamiento seguro por Mercado Pago (INMEJORA)</span>
                </div>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;