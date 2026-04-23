import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingPlans from '@/components/pricing/PricingPlans';
import ComparisonTable from '@/components/pricing/ComparisonTable';
import TrustSection from '@/components/pricing/TrustSection';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Helmet>
        <title>Planes y Precios | INMEJORA - Desde $15.000/mes</title>
        <meta name="description" content="Plan Básico desde $15.000/mes y Plan Pro desde $22.000/mes. Renders con IA, cotizador de reformas y asesoramiento para tu hogar en Argentina." />
        <meta property="og:title" content="Planes y Precios | INMEJORA - Desde $15.000/mes" />
        <meta property="og:description" content="Plan Básico desde $15.000/mes y Plan Pro desde $22.000/mes. Renders con IA, cotizador de reformas y asesoramiento para tu hogar en Argentina." />
        <meta property="og:url" content="https://inmejora.com/precios" />
        <link rel="canonical" href="https://inmejora.com/precios" />
      </Helmet>

      <Header />

      <main className="flex-grow pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
        
        <PricingPlans />
        <ComparisonTable />
        <TrustSection />

        <div className="container mx-auto px-4 text-center mt-8">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            Pagos procesados de forma segura por Mercado Pago. Podés pagar con tarjeta de crédito, débito, transferencia o saldo en cuenta.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;