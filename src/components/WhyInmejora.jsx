import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Shield, Calculator, Palette, CheckCircle2, XCircle } from 'lucide-react';

const WhyInmejora = () => {
  const cards = [
    {
      icon: Hammer,
      title: "Hecha para construcción y diseño",
      description: "Nuestra IA está entrenada específicamente para arquitectura, interiorismo y reformas. No es una herramienta genérica, entiende de espacios."
    },
    {
      icon: Shield,
      title: "Tu espacio, sin distorsiones",
      description: "Mantiene la estructura original de tus ambientes intacta mientras aplica el nuevo diseño, respetando dimensiones, aberturas y proporciones."
    },
    {
      icon: Calculator,
      title: "Presupuestos con precios reales",
      description: "Cotizamos tu reforma basándonos en costos y variables actualizadas del mercado argentino, dándote un panorama claro antes de empezar."
    },
    {
      icon: Palette,
      title: "Productos que podés comprar",
      description: "Te sugerimos materiales, texturas y elementos que realmente existen y podés conseguir con nuestra red de proveedores locales."
    }
  ];

  const comparisonData = [
    {
      feature: "Especialización",
      inmejora: "Diseño de interiores y arquitectura",
      generic: "Textos e imágenes aleatorias"
    },
    {
      feature: "Fidelidad de imagen",
      inmejora: "Mantiene estructura original",
      generic: "Distorsiona el espacio"
    },
    {
      feature: "Cotización integrada",
      inmejora: "Sí, precios reales del mercado argentino",
      generic: "No ofrece cotizaciones"
    },
    {
      feature: "Productos reales",
      inmejora: "Sí, del mercado local",
      generic: "No, elementos inventados"
    },
    {
      feature: "Margen de error",
      inmejora: "Muy bajo",
      generic: "Alto, resultados impredecibles"
    },
    {
      feature: "Asistente especializado",
      inmejora: "Sí, soporte continuo por WhatsApp",
      generic: "No, solo plataforma web básica"
    }
  ];

  return (
    <section className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            ¿Por qué INMEJORA es diferente?
          </h2>
          <p className="text-[#d4af37] text-lg md:text-xl font-medium">
            La única plataforma de IA diseñada exclusivamente para tu hogar
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#141414] border border-white/5 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-lg bg-[#d4af37]/10 flex items-center justify-center mb-6 group-hover:bg-[#d4af37]/20 transition-colors">
                <card.icon className="w-7 h-7 text-[#d4af37]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-gray-400 leading-relaxed">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr>
                    <th className="px-6 py-5 border-b border-white/10 bg-[#1a1a1a] text-gray-400 font-semibold w-1/3">
                      Característica
                    </th>
                    <th className="px-6 py-5 border-b border-white/10 bg-[#1a1a1a] text-white font-bold w-1/3 text-center border-l border-r border-white/5 relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#d4af37]"></div>
                      INMEJORA
                    </th>
                    <th className="px-6 py-5 border-b border-white/10 bg-[#1a1a1a] text-gray-400 font-medium w-1/3 text-center">
                      Herramientas genéricas de IA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-300">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-sm text-center border-l border-r border-white/5 bg-[#d4af37]/5">
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-white font-medium">{row.inmejora}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex flex-col items-center gap-2 opacity-60">
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span className="text-gray-400">{row.generic}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyInmejora;