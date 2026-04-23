import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Reusable Carousel Component for Logos
const LogoCarousel = ({ items = [], autoRotateInterval = 3000, enableAutoRotate = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerPage(4);
      else if (window.innerWidth >= 768) setItemsPerPage(3);
      else setItemsPerPage(2); // Reduced for better mobile visibility
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    if (!items.length) return;
    setCurrentIndex((prev) => 
      (prev + 1) > (items.length - itemsPerPage) ? 0 : prev + 1
    );
  }, [items.length, itemsPerPage]);

  const prevSlide = () => {
    if (!items.length) return;
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, items.length - itemsPerPage) : prev - 1
    );
  };

  // Auto-rotation
  useEffect(() => {
    if (!enableAutoRotate || !items.length) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoRotateInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoRotateInterval, enableAutoRotate, items.length]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group w-full max-w-full overflow-hidden px-4 md:px-12">
      <div className="overflow-hidden w-full">
        <motion.div
          className="flex gap-2 md:gap-8"
          initial={false}
          animate={{ x: `-${currentIndex * (100 / items.length)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ width: `${(items.length / itemsPerPage) * 100}%` }}
        >
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 flex items-center justify-center p-1 md:p-4"
              style={{ width: `${100 / items.length}%` }}
            >
              <div className="w-full h-24 sm:h-32 md:h-40 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center p-4 md:p-6 hover:bg-white/10 transition-colors duration-300 relative group/item overflow-hidden">
                {item.url ? (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      {item.logo !== 'text' ? (
                        <>
                          <img
                            src={item.logo}
                            alt={`Logo de ${item.name}`}
                            className={`max-w-full max-h-[70%] w-auto object-contain filter grayscale opacity-70 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-300 ${item.isSpecial ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''}`}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-full items-center justify-center bg-[#2d2d2d] rounded-lg shadow-md border border-gray-700 p-2 text-center text-sm md:text-xl font-bold text-white tracking-wider uppercase">
                            {item.name}
                          </div>
                        </>
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-[#2d2d2d] rounded-lg shadow-md border border-gray-700 p-2 text-center text-sm md:text-xl font-bold text-white tracking-wider uppercase">
                           {item.name}
                         </div>
                      )}
                      
                      {/* Trademark Symbol for Artecret */}
                      {item.isSpecial && (
                        <span className="absolute top-0 right-2 text-[8px] leading-none font-bold text-white opacity-70 group-hover/item:opacity-100 transition-opacity border border-white/40 rounded-full w-3 h-3 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                          R
                        </span>
                      )}
                    </div>

                     {item.isSpecial && (
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-[8px] md:text-xs text-[#FCD34D] opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap font-medium tracking-wide bg-black/80 px-2 py-1 rounded">
                          Ver en Instagram
                        </span>
                      )}
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {item.logo !== 'text' ? (
                      <>
                        <img
                          src={item.logo}
                          alt={`Logo de ${item.name}`}
                          className="max-w-full max-h-[70%] w-auto object-contain filter grayscale opacity-60 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center bg-[#2d2d2d] rounded-lg shadow-md border border-gray-700 p-2 text-center text-sm md:text-xl font-bold text-white tracking-wider uppercase transition-colors duration-300 group-hover/item:bg-[#3a3a3a]">
                          {item.name}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#2d2d2d] rounded-lg shadow-md border border-gray-700 p-2 text-center text-sm md:text-xl font-bold text-white tracking-wider uppercase transition-colors duration-300 group-hover/item:bg-[#3a3a3a]">
                        {item.name}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-1 md:p-2 bg-black/50 hover:bg-[#FCD34D]/20 text-white rounded-full transition-colors backdrop-blur-sm border border-white/10 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-1 md:p-2 bg-black/50 hover:bg-[#FCD34D]/20 text-white rounded-full transition-colors backdrop-blur-sm border border-white/10 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

const Aliados = () => {
  const materialesBrands = [
    {
      name: 'Artecret',
      logo: 'https://artecret.com.ar/wp-content/uploads/2024/01/logo-artecret-blanco.png',
      url: 'https://www.instagram.com/artecret.oficial/',
      isSpecial: true
    },
    {
      name: 'Sherwin Williams',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Sherwin-Williams.svg/2560px-Sherwin-Williams.svg.png'
    },
    {
      name: 'Alba',
      logo: 'text'
    },
    {
      name: 'FV',
      logo: 'text'
    },
    {
      name: 'Ferrum',
      logo: 'text'
    },
    {
      name: 'Weber',
      logo: 'text'
    }
  ];

  const empresasBrands = [
    {
      name: 'Remax',
      logo: 'text'
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-black via-black to-black/95 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Nuestros Aliados
          </h2>
          <p className="text-gray-400 text-lg">
            Trabajamos con las mejores marcas y empresas del mercado
          </p>
        </div>

        <div className="mb-16 overflow-x-hidden w-full max-w-full">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-8 text-center">
            Marcas de Materiales
          </h3>
          <LogoCarousel items={materialesBrands} autoRotateInterval={4000} />
        </div>

        <div className="overflow-x-hidden w-full max-w-full">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-8 text-center">
            Empresas Asociadas
          </h3>
          <LogoCarousel items={empresasBrands} autoRotateInterval={4000} />
        </div>
      </div>
    </section>
  );
};

export default Aliados;