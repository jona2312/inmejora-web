import React from 'react';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';
import ContactForm from '@/components/ContactForm';
import { Mail, MessageCircle, MapPin } from 'lucide-react';

const Contacto = () => {
  return (
    <section id="contacto" className="py-16 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#D4AF37]/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <ScrollAnimationWrapper>
          <div className="text-center mb-12 md:mb-16">
            <span className="text-xs md:text-sm text-[#D4AF37] font-semibold uppercase tracking-wider">Contacto</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white">
              Empezá tu transformación
            </h2>
            <p className="text-base md:text-lg text-gray-400 mt-4 max-w-2xl mx-auto">
              Estamos listos para escuchar tus ideas y convertirlas en realidad.
            </p>
          </div>
        </ScrollAnimationWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto items-start">
          {/* Contact Info Side */}
          <ScrollAnimationWrapper>
             <div className="space-y-10 pt-4">
                <div className="prose prose-invert">
                    <h3 className="text-2xl font-bold text-white mb-4">Información de Contacto</h3>
                    <p className="text-gray-400 leading-relaxed">
                        ¿Tenés dudas sobre nuestros servicios o querés un presupuesto personalizado? 
                        Escribinos y un especialista se pondrá en contacto con vos a la brevedad.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
                        <div className="bg-[#D4AF37]/10 p-3 rounded-lg text-[#D4AF37]">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">WhatsApp</h4>
                            <p className="text-sm text-gray-400 mb-1">Respuesta rápida</p>
                            <a href="https://wa.me/5491168000741" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline font-medium">
                                +54 9 11 6800-0741
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
                        <div className="bg-[#D4AF37]/10 p-3 rounded-lg text-[#D4AF37]">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">Email</h4>
                            <p className="text-sm text-gray-400 mb-1">Consultas generales</p>
                            <a href="mailto:info@inmejora.com" className="text-[#D4AF37] hover:underline font-medium">
                                info@inmejora.com
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#D4AF37]/30 transition-colors">
                         <div className="bg-[#D4AF37]/10 p-3 rounded-lg text-[#D4AF37]">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">Oficina</h4>
                            <p className="text-sm text-gray-400">
                                Buenos Aires, Argentina<br />
                                Atención con cita previa
                            </p>
                        </div>
                    </div>
                </div>
             </div>
          </ScrollAnimationWrapper>

          {/* Form Side */}
          <ScrollAnimationWrapper>
            <ContactForm />
          </ScrollAnimationWrapper>
        </div>
      </div>
    </section>
  );
};

export default Contacto;