import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProveedoresHero from '@/components/proveedores/ProveedoresHero';
import BenefitsSection from '@/components/proveedores/BenefitsSection';
import HowItWorksSection from '@/components/proveedores/HowItWorksSection';
import FinalCTASection from '@/components/proveedores/FinalCTASection';
import ProveedorRegistrationForm from '@/components/proveedores/ProveedorRegistrationForm';

const ProveedoresPage = () => {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Helmet>
        <title>Red de Proveedores INMEJORA | Conectate con Clientes en Reforma</title>
        <meta name="description" content="Sumate a la red de proveedores de INMEJORA. Conectá tus productos con miles de clientes en proceso de reforma en Zona Sur GBA. Registro gratuito." />
        <meta property="og:title" content="Red de Proveedores INMEJORA | Conectate con Clientes en Reforma" />
        <meta property="og:description" content="Sumate a la red de proveedores de INMEJORA. Conectá tus productos con miles de clientes en proceso de reforma en Zona Sur GBA. Registro gratuito." />
        <meta property="og:url" content="https://inmejora.com/proveedores" />
        <link rel="canonical" href="https://inmejora.com/proveedores" />
      </Helmet>

      <Header />
      
      <main className="flex-grow pt-0">
        <ProveedoresHero />
        <ProveedorRegistrationForm />
        <BenefitsSection />
        <HowItWorksSection />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
};

export default ProveedoresPage;