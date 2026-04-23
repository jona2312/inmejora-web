import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Home, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      <Helmet>
        <title>Página no encontrada | INMEJORA</title>
        <meta name="description" content="Esta página no existe. Volvé al inicio de INMEJORA para explorar nuestros servicios de reforma y diseño de interiores con IA." />
        <meta property="og:url" content="https://inmejora.com/404" />
        <link rel="canonical" href="https://inmejora.com/404" />
      </Helmet>

      <Header />

      <main className="flex-grow flex items-center justify-center px-4 py-20 pt-32">
        <div className="max-w-2xl w-full text-center">
          {/* Logo Branding */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link to="/" className="inline-flex items-baseline">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">IN</span>
              <span className="text-4xl md:text-5xl font-black text-[#d4af37] tracking-tight ml-1">MEJORA</span>
            </Link>
          </motion.div>

          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-[120px] md:text-[180px] lg:text-[220px] font-black text-[#d4af37] leading-none drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              404
            </h1>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Esta página no existe
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-lg mx-auto"
          >
            La página que buscás no está disponible o fue movida.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/">
              <Button 
                size="lg"
                className="bg-[#d4af37] hover:bg-[#b5952f] text-black font-bold px-8 py-6 text-lg rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] flex items-center gap-2 w-full sm:w-auto"
              >
                <Home className="w-5 h-5" />
                Volver al inicio
              </Button>
            </Link>

            <Link to="/precios">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8 py-6 text-lg rounded-lg transition-all duration-300 flex items-center gap-2 w-full sm:w-auto"
              >
                <DollarSign className="w-5 h-5" />
                Ver precios
              </Button>
            </Link>
          </motion.div>

          {/* Decorative Element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0 pointer-events-none overflow-hidden -z-10"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37] rounded-full blur-[150px] opacity-10"></div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;