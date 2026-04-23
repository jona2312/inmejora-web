import React from 'react';
import { motion } from 'framer-motion';
import { Users, Settings, TrendingUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const benefits = [
  {
    icon: Users,
    title: "Nuevos clientes",
    description: "Accedé a nuestra red de clientes que buscan materiales y servicios para sus obras."
  },
  {
    icon: Settings,
    title: "Gestión simple",
    description: "Cargá tus precios por Excel, PDF o manualmente desde tu panel. Actualizá cuando quieras."
  },
  {
    icon: TrendingUp,
    title: "Crecé con nosotros",
    description: "Cuanto más competitivos sean tus precios, más te recomendamos a nuestros clientes."
  }
];

const BenefitsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-16 md:py-24 bg-[#0a0a0a] relative z-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Beneficios de unirte
          </h2>
          <div className="w-24 h-1 bg-[#FCD34D] mx-auto rounded-full" />
        </div>

        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-[#141414] p-8 rounded-xl border border-gray-800 hover:border-[#FCD34D]/50 shadow-lg hover:shadow-2xl hover:shadow-[#FCD34D]/10 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-6 border border-gray-800 group-hover:border-[#FCD34D]/50 transition-colors">
                <benefit.icon className="w-8 h-8 text-[#FCD34D]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#FCD34D] transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;