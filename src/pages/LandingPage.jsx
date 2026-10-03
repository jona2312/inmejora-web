import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SalesSEO from '@/components/sales/SalesSEO';
import { SalesHeader, SalesFooter } from '@/components/sales/SalesLayout';
import { SalesHero, ServicesSection, HowItWorks, WorksSection, ZonesSection, FaqSection, FinalCTA } from '@/components/sales/sections';

const LandingPage = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [hash]);

  return (
    <div className="relative overflow-x-hidden bg-background text-foreground">
      <SalesSEO
        path="/"
        schema
        title="Reformas y terminaciones en Hudson, Berazategui y Quilmes | INMEJORA"
        description="Remodelaciones, pintura, impermeabilización, pisos y ampliaciones en zona sur del GBA. Contanos tu proyecto y recibí tu presupuesto en 24 a 72 horas desde que tenemos la información necesaria."
      />
      <SalesHeader />
      <main id="main-content">
        <SalesHero />
        <ServicesSection />
        <HowItWorks />
        <WorksSection />
        <ZonesSection />
        <FaqSection />
        <FinalCTA />
      </main>
      <SalesFooter />
    </div>
  );
};

export default LandingPage;
