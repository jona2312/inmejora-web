import React from 'react';
import { Home, Building, Palette, Bot } from 'lucide-react';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const services = [
  {
    icon: Home,
    title: 'Reformas Integrales',
    description: 'Transformamos tu vivienda por completo, desde la distribución hasta los acabados finales. Nos encargamos de todo el proceso.',
  },
  {
    icon: Building,
    title: 'Diseño de Exteriores',
    description: 'Creamos y renovamos patios, terrazas, jardines y fachadas. Diseñamos espacios al aire libre funcionales y estéticos.',
  },
  {
    icon: Palette,
    title: 'Diseño de Interiores',
    description: 'Conceptualizamos y diseñamos cada rincón de tu hogar. Seleccionamos mobiliario, iluminación, colores y texturas.',
  },
  {
    icon: Bot,
    title: 'Visualización con IA',
    description: 'Utilizamos inteligencia artificial para generar visualizaciones realistas de tu proyecto. Ver el resultado antes de la obra.',
  },
];

const AnimatedCounter = ({ end, duration }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <span ref={ref}>
            {inView ? <CountUp end={end} duration={duration} separator="." /> : '0'}
        </span>
    );
};

const Servicios = () => {
  return (
    <section id="servicios" className="py-16 md:py-24 lg:py-32 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs md:text-sm text-[#D4AF37] font-semibold uppercase tracking-wider">Nuestros Servicios</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-2 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent">
              Soluciones para tu Hogar
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 mt-3 md:mt-4 max-w-3xl mx-auto leading-relaxed">
              Ofrecemos un servicio completo que abarca desde la idea inicial hasta la ejecución final del proyecto.
            </p>
          </div>
        </ScrollAnimationWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-20">
          {services.map((service, index) => (
            <ScrollAnimationWrapper key={index} delay={index * 0.1}>
              <div className="bg-[#141414] p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#8B5CF6]/20 to-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                    <service.icon className="text-[#D4AF37] w-6 h-6 md:w-8 md:h-8" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>
        
        <ScrollAnimationWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-center max-w-4xl mx-auto">
                <div className="bg-[#141414] p-6 md:p-8 rounded-2xl border border-gray-800">
                    <h4 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#D4AF37]">
                        +<AnimatedCounter end={30} duration={2.5} />
                    </h4>
                    <p className="text-sm md:text-base text-gray-400 mt-2">Proyectos Realizados</p>
                </div>
                 <div className="bg-[#141414] p-6 md:p-8 rounded-2xl border border-gray-800">
                    <h4 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#D4AF37]">
                        +<AnimatedCounter end={98} duration={2.5} />%
                    </h4>
                    <p className="text-sm md:text-base text-gray-400 mt-2">Clientes Satisfechos</p>
                </div>
                 <div className="bg-[#141414] p-6 md:p-8 rounded-2xl border border-gray-800">
                    <h4 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#D4AF37]">
                       +<AnimatedCounter end={10} duration={2.5} />
                    </h4>
                    <p className="text-sm md:text-base text-gray-400 mt-2">Años de Experiencia</p>
                </div>
            </div>
        </ScrollAnimationWrapper>

      </div>
    </section>
  );
};

export default Servicios;