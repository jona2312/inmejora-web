import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: '¿Cómo funciona el plan gratuito?',
      answer: 'El plan gratuito te permite explorar la plataforma y generar hasta 3 renders de prueba con marca de agua y resolución estándar para que conozcas el poder de nuestra IA y experimentes con tus primeros rediseños.'
    },
    {
      question: '¿Qué diferencia hay entre los planes?',
      answer: 'El Plan Básico te ofrece 10 renders mensuales en Full HD sin marca de agua, ideal para espacios pequeños. El Plan Pro sube a 40 renders en 4K con opciones avanzadas de texturas. El plan "Mi Proyecto" incluye un pre-proyecto completo listo para municipio, renders ilimitados y cotización real de obra.'
    },
    {
      question: '¿Cómo funciona el asistente de WhatsApp?',
      answer: 'Nuestro asistente virtual por WhatsApp está disponible 24/7. Podés enviarle fotos de tu espacio, pedirle ideas de diseño, solicitar que genere renders con indicaciones específicas o pedir presupuestos estimados, todo directamente desde tu chat.'
    },
    {
      question: '¿Los precios del presupuesto son reales?',
      answer: 'Sí, los presupuestos se calculan utilizando precios reales del mercado argentino. Actualizamos constantemente nuestra base de datos de materiales y mano de obra para brindarte un estimado preciso antes de comenzar tu obra.'
    },
    {
      question: '¿Puedo usar INMEJORA desde el celular?',
      answer: 'Totalmente. Nuestra plataforma web está optimizada para funcionar perfectamente desde cualquier dispositivo móvil. Además, al integrar nuestro asistente exclusivo por WhatsApp, ni siquiera necesitás abrir el navegador para generar renders.'
    },
    {
      question: '¿Qué pasa si no me gusta el render?',
      answer: 'Podés generar múltiples variaciones usando tus créditos. Tenés la libertad de ajustar el estilo de diseño, cambiar la paleta de colores, modificar texturas o agregar instrucciones específicas hasta lograr el resultado exacto que estás buscando.'
    },
    {
      question: '¿Trabajan en toda Argentina?',
      answer: 'Sí, nuestra plataforma de diseño con IA está disponible para todo el país. Todos los precios de materiales y estimaciones de presupuestos están adaptados exclusivamente al mercado de la construcción y diseño de Argentina.'
    },
    {
      question: '¿Cómo me registro?',
      answer: 'Es muy simple. Hacé clic en el botón "Probá gratis", ingresá tus datos básicos o conectate rápidamente con tu cuenta de Google, y ya vas a poder empezar a transformar tus espacios al instante.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-20 bg-[#0f0f0f]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] bg-clip-text text-transparent">
            Encontrá las respuestas
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto px-2">
            Resolvemos tus dudas sobre nuestros servicios y procesos
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden hover:border-[#D4AF37] transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-4 md:p-6 text-left flex items-center justify-between gap-3 md:gap-4 group"
              >
                <span className="text-base md:text-lg font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-[#D4AF37] flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 md:px-6 md:pb-6 text-sm md:text-base text-gray-400 leading-relaxed border-t border-gray-800 pt-3 md:pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;