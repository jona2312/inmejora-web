import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { featuredProjects } from '@/data/projectsData';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';
import ProjectModal from '@/components/ProjectModal';
import { ZoomIn } from 'lucide-react';

const ProyectosDestacados = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollAnimationWrapper>
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider mb-2 block">
              NUESTRO TRABAJO
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Proyectos Destacados
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Explorá la transformación completa de espacios reales. Interactuá con cada imagen para ver el proceso de renovación.
            </p>
          </div>
        </ScrollAnimationWrapper>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {featuredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              viewport={{ once: true, amount: 0.1 }}
              className="group relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300"
              onClick={() => setSelectedProject(project)}
            >
              {/* Image */}
              <img
                src={project.image}
                alt={project.category}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

              {/* Badge */}
              <div className="absolute top-4 left-4 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide z-20 shadow-lg">
                {project.category}
              </div>

              {/* Hover Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 z-20">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                   <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 text-white">
                      <ZoomIn size={20} />
                   </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                  {project.category}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                   {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <ProjectModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject} 
      />
    </section>
  );
};

export default ProyectosDestacados;