import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import CTAButton from '@/components/CTAButton';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';

const faqs = [
  {
    id: 1,
    question: "¿Cuánto tiempo tarda un render 3D?",
    answer: "El tiempo de entrega depende de la complejidad del proyecto. Para renders simples (ej. una habitación interior), el tiempo estimado es de 3 a 5 días hábiles. Para proyectos más complejos o grandes escalas, puede tomar de 1 a 2 semanas."
  },
  {
    id: 2,
    question: "¿Cuál es el costo de un render 3D?",
    answer: "Cada proyecto es único, por lo que realizamos presupuestos personalizados. El costo varía según la cantidad de imágenes, el nivel de detalle requerido, si se necesitan modelos 3D a medida y si incluye animación o recorridos virtuales."
  },
  {
    id: 3,
    question: "¿Puedo hacer cambios después de ver el primer render?",
    answer: "Sí, por supuesto. Todos nuestros presupuestos incluyen una ronda de revisiones y ajustes menores (cambio de texturas, colores, iluminación) sobre las imágenes preliminares en baja resolución, antes de renderizar la versión final en alta calidad."
  },
  {
    id: 4,
    question: "¿Qué formatos de archivo entrego?",
    answer: "Entregamos las imágenes fijas en formato JPG o PNG en alta resolución (4K), ideales para impresión o uso en plataformas digitales. Si contratas un recorrido virtual, lo entregamos en formato MP4 en Full HD o 4K."
  },
  {
    id: 5,
    question: "¿Necesito proporcionar planos específicos?",
    answer: "Para lograr la máxima precisión, te pedimos que nos proporciones planos arquitectónicos (plantas, cortes, fachadas) preferentemente en formato DWG (AutoCAD) o PDF. También son muy útiles las referencias visuales de estilo y materiales que deseas."
  }
];

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border border-gray-800 bg-[#141414] rounded-xl overflow-hidden mb-4 hover:border-gray-700 transition-colors duration-300">
      <button
        className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none group"
        onClick={onClick}
      >
        <span className={`font-semibold text-lg transition-colors duration-300 ${isOpen ? 'text-[hsl(var(--accent-cta))]' : 'text-gray-200 group-hover:text-white'}`}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`flex-shrink-0 ml-4 p-1 rounded-full ${isOpen ? 'bg-[hsl(var(--accent-cta))]/20 text-[hsl(var(--accent-cta))]' : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700'}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-2 text-gray-400 leading-relaxed border-t border-gray-800/50 mx-6">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a] relative" id="faq">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollAnimationWrapper>
            <div className="text-center mb-16">
              <span className="text-[hsl(var(--accent-cta))] text-sm font-bold uppercase tracking-wider mb-3 block">
                Preguntas Frecuentes
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Resolvemos tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--accent-cta))] to-[#d4af37]">dudas</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Encuentra las respuestas a las consultas más comunes sobre nuestros servicios de renderizado 3D y visualización arquitectónica.
              </p>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper delay={0.2}>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openIndex === index}
                  onClick={() => handleToggle(index)}
                />
              ))}
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper delay={0.4}>
            <div className="mt-16 text-center bg-[#141414] p-8 md:p-12 rounded-2xl border border-gray-800/60 shadow-xl">
              <MessageCircle className="w-12 h-12 text-[hsl(var(--accent-cta))] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">¿Aún tienes dudas?</h3>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Nuestro equipo de expertos está listo para asesorarte en tu próximo proyecto. Escríbenos y te responderemos a la brevedad.
              </p>
              <CTAButton 
                text="Contactanos ahora" 
                href="/contacto" 
                size="lg"
                variant="primary"
              />
            </div>
          </ScrollAnimationWrapper>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;