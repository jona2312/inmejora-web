import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transformacionesData } from '@/data/TransformacionesRealesData';

const BeforeAfterCard = ({ transformation }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-2xl cursor-ew-resize select-none shadow-2xl group bg-[#1a1a1a]"
      onMouseMove={onMouseMove}
      onMouseDown={handleMouseDown}
      onTouchMove={onTouchMove}
      onTouchStart={handleMouseDown}
    >
      {/* After Image */}
      <img
        src={transformation.afterImage}
        alt={`${transformation.roomType} Después`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        draggable="false"
        style={{ objectFit: 'cover' }}
      />

      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full z-10 pointer-events-none border border-white/10">
        DESPUÉS
      </div>

      {/* Before Image */}
      <div
        className="absolute inset-0 overflow-hidden slider-clip-transition"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={transformation.beforeImage}
          alt={`${transformation.roomType} Antes`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          draggable="false"
          style={{ objectFit: 'cover' }}
        />

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-black text-xs font-bold px-3 py-1 rounded-full z-10 pointer-events-none shadow-lg">
          ANTES
        </div>
      </div>

      {/* Etiqueta de transparencia: imagen no presentada como obra real */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-gray-300 text-[10px] font-medium px-2 py-0.5 rounded-full z-10 pointer-events-none border border-white/10">
        Visualización conceptual
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#c9a84c] rounded-full shadow-lg flex items-center justify-center border-2 border-white hover:scale-110 transition-transform">
          <ChevronLeft className="w-4 h-4 text-black absolute left-0.5" />
          <ChevronRight className="w-4 h-4 text-black absolute right-0.5" />
        </div>
      </div>
    </div>
  );
};

const TransformacionesReales = () => {
  const navigate = useNavigate();

  // Stats ocultas temporalmente hasta contar con cifras verificables
  // const stats = [ '1.100+ renders', '300+ clientes', '30s', '★ 4.9' ];

  const differentiators = [
    {
      icon: '🤖',
      title: 'Renders con IA',
      description: 'Visualizá tu reforma antes de empezar. Renders realistas generados en segundos.'
    },
    {
      icon: '📊',
      title: 'Cotización Personalizada',
      description: 'Presupuesto a medida según superficie, materiales, estado del inmueble y alcance del trabajo.'
    },
    {
      icon: '💬',
      title: 'WhatsApp Directo',
      description: 'Comunicate instantáneamente para coordinar visita y empezar tu proyecto.'
    }
  ];

  return (
    <section className="bg-[#0a0a0a] py-20 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-[#c9a84c]/20 text-[#c9a84c] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-[#c9a84c]/30">
            SIMULACIONES DE REFORMA
          </div>
          <h2 className="text-responsive-xl font-black text-white mb-6">
            Visualizá el cambio
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Así podría quedar tu espacio. Deslizá para comparar y pedí tu cotización personalizada.
          </p>
        </motion.div>

        {/* Stats Row oculta temporalmente: cifras sin respaldo verificable */}

        {/* Hero CTA Card */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="gradient-gold-indigo rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-2xl md:text-4xl font-black text-white mb-8 text-center">
              ¿Querés ver tu espacio transformado?
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/portal/renders')}
                className="bg-[#c9a84c] hover:bg-[#b59840] text-black font-bold py-6 px-8 rounded-xl text-lg shadow-[0_0_30px_rgba(201,168,76,0.5)] transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                ✨ Crear mi render gratis
              </Button>

              <Button
                onClick={() => navigate('/cotizador')}
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-6 px-8 rounded-xl text-lg backdrop-blur-sm transition-all"
              >
                <FileText className="w-5 h-5 mr-2" />
                📊 Solo quiero el presupuesto
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Transformation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {transformacionesData.map((transformation, index) => (
            <motion.div
              key={transformation.id}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden hover:border-[#c9a84c]/50 transition-all duration-300"
            >
              <BeforeAfterCard transformation={transformation} />

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {transformation.roomType}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {transformation.description}
                </p>

                <Button
                  onClick={() => navigate('/presupuesto')}
                  variant="outline"
                  className="w-full border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 font-semibold"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Cotizar esta reforma →
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Differentiators Section */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {differentiators.map((item, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center hover:border-[#c9a84c]/50 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => window.open('https://www.instagram.com/inmejora.ar', '_blank')}
            className="gradient-instagram text-white font-bold py-6 px-8 rounded-xl text-lg shadow-[0_0_30px_rgba(131,58,180,0.5)] hover:shadow-[0_0_50px_rgba(131,58,180,0.7)] transition-all"
          >
            📸 Ver más en Instagram
          </Button>
          <p className="text-gray-400 mt-4">@inmejora.ar</p>
        </motion.div>
      </div>
    </section>
  );
};

export default TransformacionesReales;