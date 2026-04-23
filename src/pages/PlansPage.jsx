import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCurrentPlan } from '@/hooks/useCurrentPlan';
import PlanCard from '@/components/plans/PlanCard';
import SEOHead from '@/components/SEOHead';
import { useMercadoPagoCheckout } from '@/hooks/useMercadoPagoCheckout';

const PlansPage = () => {
  const navigate = useNavigate();
  const { currentPlan, loading: currentPlanLoading } = useCurrentPlan();
  const { handleSubscribe, loadingProductId } = useMercadoPagoCheckout();

  // Correct product IDs mapped here matching backend expectations
  const plansData = [
    {
      id: 'basico_mensual',
      name: 'Plan Básico',
      description: 'Ideal para empezar a explorar tus espacios y generar renders básicos.',
      priceString: '$15.000 ARS',
      billingPeriod: 'por mes',
      features: ['3 análisis de ambiente con IA', 'Acceso a galería', 'Soporte básico'],
    },
    {
      id: 'pro_monthly',
      name: 'Pro Mensual',
      description: 'Para quienes buscan resultados profesionales y de alta calidad.',
      priceString: '$22.000 ARS',
      billingPeriod: 'por mes',
      features: ['5 renders de alta calidad/mes', 'Generación prioritaria', 'Soporte WhatsApp', 'Descargas 4K'],
    },
    {
      id: 'pro_annual',
      name: 'Pro Anual',
      description: 'La opción inteligente para uso continuo de las herramientas.',
      priceString: '$168.000 ARS',
      billingPeriod: 'por año',
      features: ['Todo lo de Pro Mensual', '2 meses bonificados', 'Acceso anticipado a funciones'],
    },
    {
      id: 'mi_proyecto',
      name: 'Mi Proyecto',
      description: 'Solución integral para reformar un espacio completo a medida.',
      priceString: '$353.000 ARS',
      billingPeriod: 'pago único',
      features: ['Renders ilimitados por proyecto', 'Asesor dedicado', 'Planos técnicos', 'Lista de compras'],
    }
  ];

  const handleSelectPlan = (plan) => {
    // Passes the exact plan id to the checkout handler
    handleSubscribe(plan.id);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      <SEOHead 
        title="Planes y Precios | INMEJORA - Renders 3D"
        description="Conoce nuestros planes de renders 3D. Opciones flexibles para proyectos pequeños, medianos y grandes."
        ogUrl="https://inmejora.com/planes"
      />
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 lg:px-8 py-12 pt-28">
        
        {/* Navigation & Header */}
        <div className="mb-8">
            <Button 
                variant="ghost" 
                className="text-gray-400 hover:text-white pl-0 gap-2 mb-6"
                onClick={() => navigate('/portal/dashboard')}
            >
                <ArrowLeft size={16} /> Volver al Dashboard
            </Button>

            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                   Nuestros Planes
                </h1>
                <p className="text-gray-400 text-lg">
                   Elige el plan que mejor se adapte a tus necesidades y comienza a transformar tus espacios.
                </p>
            </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto">
          {plansData.map((plan, index) => {
            const isLoading = currentPlanLoading || loadingProductId === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <PlanCard 
                    plan={plan}
                    isCurrentPlan={currentPlan?.id === plan.id}
                    onSelect={handleSelectPlan}
                    loading={isLoading}
                />
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlansPage;