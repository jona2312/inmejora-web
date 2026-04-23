import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import CTAButton from '@/components/CTAButton';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';

const testimonials = [
  {
    id: 1,
    name: "Arq. María González",
    company: "González & Asociados Arquitectos",
    project: "Edificio Residencial - Belgrano, CABA",
    quote: "La calidad de los renders superó nuestras expectativas. Nos permitieron vender el 40% del edificio en pozo antes de iniciar la obra. El nivel de detalle en la iluminación y materiales es excepcional.",
    avatar: "https://images.unsplash.com/photo-1603453734400-3995f8ed5bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 5
  },
  {
    id: 2,
    name: "Ing. Carlos Rodríguez",
    company: "Constructora Rodríguez S.A.",
    project: "Centro Comercial - La Plata",
    quote: "Trabajar con INMEJORA nos ahorró semanas de idas y vueltas con el cliente. Al ver el render final con calidad fotorrealista, aprobaron el diseño de inmediato. Su equipo es muy profesional y rápido.",
    avatar: "https://images.unsplash.com/photo-1635249578213-68b0aa67fdf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 5
  },
  {
    id: 3,
    name: "Arq. Lucía Fernández",
    company: "Estudio Fernández Diseño",
    project: "Vivienda Unifamiliar - San Isidro",
    quote: "Es increíble cómo captan la esencia de cada espacio. Los renders de interiorismo que hicieron para esta casa lograron transmitir exactamente la calidez que buscábamos. Mis clientes quedaron fascinados.",
    avatar: "https://images.unsplash.com/photo-1590769620285-6926a01c2a58?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 5
  },
  {
    id: 4,
    name: "Arq. Roberto Martínez",
    company: "Martínez Proyectos Inmobiliarios",
    project: "Complejo Residencial - Caballito",
    quote: "Un servicio impecable de principio a fin. Los videos recorridos y las imágenes 4K fueron la pieza clave para nuestra campaña de marketing digital. Definitivamente volveremos a trabajar juntos.",
    avatar: "https://images.unsplash.com/photo-1697425567988-994f06671246?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 5
  }
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden" id="testimonios">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-[hsl(var(--accent-cta))]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollAnimationWrapper>
          <div className="text-center mb-16 md:mb-24">
            <span className="text-[hsl(var(--accent-cta))] text-sm font-bold uppercase tracking-wider mb-3 block">
              Casos de Éxito
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Lo que dicen nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--accent-cta))] to-[#d4af37]">clientes</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Profesionales del sector ya confían en nosotros para visualizar y vender sus proyectos antes de poner un solo ladrillo.
            </p>
          </div>
        </ScrollAnimationWrapper>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id}
              variants={itemVariants}
              className="bg-[#141414] border border-gray-800/60 rounded-2xl p-8 relative group hover:border-gray-700 transition-colors duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/50"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-gray-800/50 group-hover:text-[hsl(var(--accent-cta))]/10 transition-colors duration-300" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
                ))}
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-8 italic relative z-10">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto border-t border-gray-800/50 pt-6">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-800 group-hover:border-[hsl(var(--accent-cta))]/50 transition-colors duration-300"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-[hsl(var(--accent-cta))] font-medium">{testimonial.company}</p>
                  <p className="text-xs text-gray-500 mt-1">{testimonial.project}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <ScrollAnimationWrapper delay={0.4}>
          <div className="mt-16 text-center">
            <CTAButton 
              text="Ver más casos de éxito" 
              href="/presupuesto" 
              size="lg"
            />
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
};

export default TestimonialsSection;