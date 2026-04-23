import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';
import BeforeAfterImageSlider from '@/components/BeforeAfterImageSlider';
import { proyectosData } from '@/data/proyectosData';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight } from 'lucide-react';

const ProjectosPage = () => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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

  const getCategoryColor = (category) => {
    const colors = {
      'Cocina': 'bg-emerald-500',
      'Baño': 'bg-blue-500',
      'Living': 'bg-purple-500',
      'Integral': 'bg-[#d4af37]',
      'Exterior': 'bg-green-500',
      'Multiambiente': 'bg-orange-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <>
      <Helmet>
        <title>Proyectos de Reforma Realizados | INMEJORA Buenos Aires</title>
        <meta 
          name="description" 
          content="Galería de transformaciones reales: cocinas, baños, livings y espacios verdes. Mirá el antes y después de cada proyecto con tecnología IA." 
        />
        <meta property="og:title" content="Proyectos de Reforma Realizados | INMEJORA Buenos Aires" />
        <meta 
          property="og:description" 
          content="Galería de transformaciones reales: cocinas, baños, livings y espacios verdes. Mirá el antes y después de cada proyecto con tecnología IA." 
        />
        <meta property="og:url" content="https://inmejora.com/proyectos" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://inmejora.com/proyectos" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/10 via-transparent to-transparent opacity-50" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[100px]" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <ScrollAnimationWrapper>
              <div className="text-center max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-block bg-[#d4af37]/20 text-[#d4af37] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-6 border border-[#d4af37]/30">
                    Nuestro Portfolio
                  </span>
                </motion.div>

                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Proyectos de Reforma
                  <br />
                  <span className="text-[#d4af37]">Realizados</span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto"
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Transformaciones reales de hogares en{' '}
                  <span className="text-white font-semibold">Zona Sur Buenos Aires</span>
                </motion.p>

                <motion.p
                  className="text-gray-400 text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Deslizá el control interactivo en cada imagen para ver el antes y después de nuestras renovaciones más destacadas.
                </motion.p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>

        {/* Projects Gallery */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            >
              {proyectosData.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="group bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#d4af37]/50 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                >
                  {/* Image Slider */}
                  <div className="relative h-[300px] md:h-[350px]">
                    <BeforeAfterImageSlider
                      beforeImage={project.beforeImage}
                      afterImage={project.afterImage}
                      title={project.title}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`${getCategoryColor(project.category)} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}>
                        {project.category}
                      </span>
                      <div className="flex items-center text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{project.location}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#d4af37] transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/10 via-transparent to-transparent opacity-40" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <ScrollAnimationWrapper>
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-10 md:p-16 rounded-3xl border border-[#d4af37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)]"
                >
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                    ¿Listo para tu{' '}
                    <span className="text-[#d4af37]">Transformación?</span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Pedí tu presupuesto sin cargo y comenzá a visualizar cómo quedaría tu espacio con nuestros renders fotorrealistas con IA.
                  </p>
                  <Link to="/presupuesto">
                    <Button
                      size="lg"
                      className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold text-lg px-10 py-7 rounded-full group shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all duration-300"
                    >
                      Solicitar Presupuesto
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ProjectosPage;