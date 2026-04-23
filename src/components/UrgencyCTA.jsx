import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Timer } from 'lucide-react';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';
import { useNavigate } from 'react-router-dom';

const UrgencyCTA = () => {
  const navigate = useNavigate();

  const handleCtaClick = () => {
    navigate('/proveedores/registro');
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-[#D4AF37]/5" />
        <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[50%] -right-[20%] w-[80%] h-[80%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollAnimationWrapper>
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-12 lg:p-16 shadow-2xl overflow-hidden group hover:border-[#D4AF37]/30 transition-colors duration-500">
              
              <div className="absolute top-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-gradient-to-br from-[#D4AF37]/20 to-transparent blur-3xl rounded-full pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16">
                
                <div className="flex-1 text-center lg:text-left space-y-4 md:space-y-6">
                  <motion.div 
                    initial={{ opacity: 1, x: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-semibold text-xs md:text-sm uppercase tracking-wider"
                  >
                    <Timer size={14} className="animate-pulse md:w-4 md:h-4" />
                    <span>Crecimiento Inmediato</span>
                  </motion.div>

                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight">
                    Multiplicá tus ventas conectando con <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCD34D]">clientes reales</span>
                  </h2>
                  
                  <div className="space-y-2">
                    <p className="text-base md:text-xl text-gray-300 font-light px-2 lg:px-0">
                      Únete hoy y empezá a cotizar proyectos de interiorismo al instante. Sin costos iniciales ocultos.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 relative w-full sm:w-auto">
                  <motion.button
                    onClick={handleCtaClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto relative group overflow-hidden bg-[#D4AF37] text-black font-bold text-base md:text-xl px-8 py-4 md:px-10 md:py-5 rounded-xl shadow-[0_0_40px_-10px_rgba(212,175,55,0.5)] hover:shadow-[0_0_60px_-15px_rgba(212,175,55,0.7)] transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <span className="relative z-10">Alta Proveedor</span>
                    <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 w-5 h-5 md:w-6 md:h-6" />
                    
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full z-0 pointer-events-none transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                  </motion.button>
                  
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute -top-12 -right-8 text-white/10 hidden lg:block"
                  >
                    <Clock size={100} strokeWidth={1} />
                  </motion.div>
                </div>

              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};

export default UrgencyCTA;