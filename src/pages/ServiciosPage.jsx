import React from 'react';
import SalesSEO from '@/components/sales/SalesSEO';
import { SalesHeader, SalesFooter } from '@/components/sales/SalesLayout';
import { ServicesSection, HowItWorks, FinalCTA } from '@/components/sales/sections';

const ServiciosPage = () => (
  <div className="relative overflow-x-hidden bg-background text-foreground">
    <SalesSEO
      path="/servicios"
      title="Servicios: remodelaciones, pintura, impermeabilización y pisos | INMEJORA"
      description="Remodelaciones, pintura y terminaciones, impermeabilización, pisos y revestimientos, construcción y ampliaciones, diseño y presupuestos. Zona sur del GBA."
    />
    <SalesHeader />
    <main id="main-content" className="pt-16 md:pt-[72px]">
      <section className="bg-[#0a0a0a] px-4 pt-14 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl md:text-5xl font-black text-white">Servicios de reforma y terminaciones</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">Contanos qué necesitás y te decimos cómo seguimos. Si el trabajo requiere visita o relevamiento, te lo informamos durante la consulta.</p>
      </section>
      <ServicesSection heading="Todos nuestros servicios" intro="Elegí uno para armar tu consulta." detailed />
      <HowItWorks />
      <FinalCTA />
    </main>
    <SalesFooter />
  </div>
);

export default ServiciosPage;
