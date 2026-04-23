import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/renders/PageHeader';
import RenderWizardContainer from '@/components/renders/RenderWizardContainer';
import RenderGallerySection from '@/components/renders/RenderGallerySection';
import ComingSoonBanner from '@/components/renders/ComingSoonBanner';

const RendersPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Helmet>
        <title>Generador de Renders IA | INMEJORA</title>
        <meta 
          name="description" 
          content="Genera renders fotorrealistas de tu espacio con inteligencia artificial. Sube tu foto, describe tu visión y recibe tu render en menos de 2 horas." 
        />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-24 md:py-32">
        <PageHeader />

        {/* Wizard Section */}
        <section className="mb-16 md:mb-24">
          <RenderWizardContainer />
        </section>

        {/* Gallery Section */}
        <section className="mb-16 md:mb-24">
          <RenderGallerySection />
        </section>

        {/* Coming Soon Banner */}
        <section>
          <ComingSoonBanner />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RendersPage;