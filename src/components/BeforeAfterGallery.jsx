import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const defaultProjects = [
  {
    category: 'Cocina',
    before_image_url: 'https://images.unsplash.com/photo-1617228069096-4638a7ffc917?w=800&q=80',
    after_image_url: 'https://images.unsplash.com/photo-1629079447841-d04df9ee2d72?w=800&q=80'
  },
  {
    category: 'Baño',
    before_image_url: 'https://images.unsplash.com/photo-1618836003104-ec6d67239040?w=800&q=80',
    after_image_url: 'https://images.unsplash.com/photo-1600607688066-890987f18a86?w=800&q=80'
  },
   {
    category: 'Living',
    before_image_url: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80',
    after_image_url: 'https://images.unsplash.com/photo-1655361129523-1b27a6465f46?w=800&q=80'
  }
];

const BeforeAfterSlider = ({ before, after, category }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e) => {
    if (!isDragging && e.type !== 'mousemove') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.type.includes('mouse') ? e.clientX : e.touches[0].clientX) - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl shadow-2xl h-[250px] sm:h-[300px] md:h-[350px] bg-gray-900"
      onMouseMove={handleMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <div className="relative w-full h-full cursor-ew-resize select-none">
        {/* After image - always visible */}
        <img
          src={after}
          alt={`${category} - Después`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Before image - always visible, clipped */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={before}
            alt={`${category} - Antes`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
            <ChevronLeft className="absolute left-0 text-gray-800 w-3 h-3 md:w-4 md:h-4" />
            <ChevronRight className="absolute right-0 text-gray-800 w-3 h-3 md:w-4 md:h-4" />
          </div>
        </div>

        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-sm font-semibold z-20 pointer-events-none">
          Antes
        </div>
        <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-sm font-semibold z-20 pointer-events-none">
          Después
        </div>

        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-[#D4AF37]/90 backdrop-blur-sm text-black px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-sm font-bold z-20 pointer-events-none uppercase tracking-wide">
          {category}
        </div>
      </div>
    </motion.div>
  );
};

const BeforeAfterGallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setProjects(defaultProjects);
      setLoading(false);
    };
    
    const timer = setTimeout(loadData, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-12 md:py-24 bg-[#0a0a0a] relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-xs md:text-base text-[#D4AF37] font-semibold uppercase tracking-wider">Portfolio</span>
          <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-[#D4AF37] via-white to-[#D4AF37] bg-clip-text text-transparent mt-2 mb-3 md:mb-4">
            Transformaciones Reales
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto px-2">
            Deslizá el control para ver el antes y después de nuestros últimos proyectos.
          </p>
        </motion.div>

        {loading ? (
            <div className="flex justify-center items-center py-20 min-h-[300px]">
                <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 md:px-0">
            {projects.map((project, index) => (
                <BeforeAfterSlider
                  key={index}
                  before={project.before_image_url}
                  after={project.after_image_url}
                  category={project.category}
                />
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default BeforeAfterGallery;