import React, { Suspense, lazy, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import Spinner from '@/components/Spinner.jsx';
import RegistrationSection from '@/components/RegistrationSection.jsx';
import AIAssistantModal from '@/components/AIAssistantModal.jsx';
import CTAButton from '@/components/CTAButton.jsx';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper.jsx';

// Lazy loaded components
const Hero = lazy(() => import('@/components/Hero.jsx'));
const HeroTextSection = lazy(() => import('@/components/HeroTextSection.jsx'));
const Soluciones = lazy(() => import('@/components/Soluciones.jsx'));
const ProyectosDestacados = lazy(() => import('@/components/ProyectosDestacados.jsx'));
const TransformacionesReales = lazy(() => import('@/components/TransformacionesReales.jsx'));
const Visualizacion = lazy(() => import('@/components/Visualizacion.jsx'));
const AsistenteIA = lazy(() => import('@/components/AsistenteIA.jsx'));
const UrgencyCTA = lazy(() => import('@/components/UrgencyCTA.jsx'));
const Aliados = lazy(() => import('@/components/Aliados.jsx'));
const ProveedoresCTA = lazy(() => import('@/components/ProveedoresCTA.jsx'));
const WhyInmejora = lazy(() => import('@/components/WhyInmejora.jsx'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection.jsx'));
const FAQSection = lazy(() => import('@/components/FAQSection.jsx'));

const LandingPage = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div className="bg-background text-foreground relative overflow-x-hidden">
      <Helmet>
        <title>INMEJORA | Renders con IA y Reformas del Hogar en Zona Sur Buenos Aires</title>
        <meta name="description" content="Visualizá tu reforma antes de hacerla. Renders fotorrealistas con IA en menos de 72hs. Reformas de cocinas, baños y livings en Zona Sur GBA. Presupuesto gratis." />
        <meta property="og:title" content="INMEJORA | Renders con IA y Reformas del Hogar en Zona Sur Buenos Aires" />
        <meta property="og:description" content="Visualizá tu reforma antes de hacerla. Renders fotorrealistas con IA en menos de 72hs. Reformas de cocinas, baños y livings en Zona Sur GBA. Presupuesto gratis." />
        <meta property="og:url" content="https://inmejora.com" />
        <link rel="canonical" href="https://inmejora.com" />
      </Helmet>

      <Header />
      <main className="pt-0 overflow-x-hidden w-full max-w-full">
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Spinner /></div>}>
            {/* Fullscreen Hero with Video */}
            <Hero />
            
            {/* Floating Action Button for AI Assistant */}
            <motion.button
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              onClick={() => setIsAIModalOpen(true)}
              className="fixed bottom-6 right-6 z-40 bg-[hsl(var(--accent-cta))] text-white font-bold py-3 px-5 rounded-full shadow-[0_0_20px_hsl(var(--accent-cta)/0.5)] hover:shadow-[0_0_30px_hsl(var(--accent-cta)/0.8)] hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Probar Asistente IA Gratis</span>
              <span className="sm:hidden">Probar IA</span>
            </motion.button>
            
            {/* Text Section immediately following Hero */}
            <div id="hero-text">
                <HeroTextSection />
            </div>
            
            <div id="proyectos">
                <ProyectosDestacados />
                <TransformacionesReales />
            </div>

            {/* Soluciones Section (Servicios Grid) - Placed after Transformaciones Reales */}
            <div id="soluciones">
                <Soluciones />
                <div className="flex justify-center pb-20 bg-[#0a0a0a]">
                  <ScrollAnimationWrapper>
                     <CTAButton 
                        text="Solicitar Presupuesto" 
                        href="/presupuesto" 
                        icon={ArrowRight}
                        size="lg"
                     />
                  </ScrollAnimationWrapper>
                </div>
            </div>
            
            {/* Testimonials added after Soluciones */}
            <TestimonialsSection />
            
            <Visualizacion />
            
            <div id="asistente-ia">
                <AsistenteIA />
            </div>
            
            <UrgencyCTA />
            
            <RegistrationSection />
            <Aliados />
            <ProveedoresCTA />
            <WhyInmejora />
            
            {/* New FAQSection replaces old FAQ */}
            <FAQSection />
        </Suspense>
      </main>
      <Footer />

      <AIAssistantModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />
    </div>
  );
};

export default LandingPage;