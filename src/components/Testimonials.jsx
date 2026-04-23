import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Loader2 } from 'lucide-react';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';
import { getTestimonials } from '@/utils/supabaseUtils';

const defaultTestimonialImage = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const result = await getTestimonials();
        if (result.success && result.data && result.data.length > 0) {
          setTestimonials(result.data);
        } else {
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Error fetching testimonials", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
        nextTestimonial();
    }, 8000); 
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (loading) {
    return (
      <section className="py-16 md:py-32 bg-[#0a0a0a] flex items-center justify-center min-h-[400px]">
         <Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" />
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-10 md:mb-16">
            <span className="text-xs md:text-sm text-[#D4AF37] font-semibold uppercase tracking-wider">Testimonios</span>
            <h2 className="text-2xl md:text-5xl font-black mt-2 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent">
              Lo que dicen nuestros clientes
            </h2>
          </div>
        </ScrollAnimationWrapper>
        
        <ScrollAnimationWrapper>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute top-0 left-0 -translate-x-4 -translate-y-8 md:-translate-x-12 md:-translate-y-12 text-gray-800 opacity-20">
              <Quote className="w-16 h-16 md:w-[120px] md:h-[120px]" />
            </div>

            <div className="bg-[#141414] border border-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-16 relative z-10 shadow-2xl shadow-black/50">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col md:flex-row items-center gap-6 md:gap-12"
                >
                  <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0">
                    <img 
                      className="w-full h-full rounded-full object-cover border-4 border-[#1a1a1a] shadow-lg" 
                      alt={current.author_name} 
                      src={current.image_url || defaultTestimonialImage} 
                    />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-3 md:mb-4 space-x-1">
                        {[...Array(current.rating || 5)].map((_, i) => (
                             <Star key={i} className="text-[#F59E0B] w-4 h-4 md:w-5 md:h-5" fill="#F59E0B" />
                        ))}
                    </div>
                    
                    <p className="text-base md:text-xl text-gray-300 italic mb-4 md:mb-6 font-light leading-relaxed">
                      "{current.content}"
                    </p>
                    
                    <div>
                      <h4 className="font-bold text-white text-base md:text-lg">{current.author_name}</h4>
                      <p className="text-xs md:text-sm text-[#D4AF37]">{current.company}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {testimonials.length > 1 && (
                <div className="flex justify-center md:justify-end gap-3 mt-6 md:mt-0 md:absolute md:bottom-12 md:right-12">
                  <button 
                    onClick={prevTestimonial} 
                    className="bg-[#1a1a1a] border border-gray-700 p-2 md:p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 group"
                    aria-label="Anterior testimonio"
                  >
                    <ChevronLeft className="text-gray-400 group-hover:text-black w-5 h-5 md:w-6 md:h-6" />
                  </button>
                  <button 
                    onClick={nextTestimonial} 
                    className="bg-[#1a1a1a] border border-gray-700 p-2 md:p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 group"
                    aria-label="Siguiente testimonio"
                  >
                    <ChevronRight className="text-gray-400 group-hover:text-black w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};

export default Testimonials;