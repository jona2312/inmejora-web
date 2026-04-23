import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, Home, Bath, Sofa, Palette, Building, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';

const SERVICE_ICONS = {
  'Cocina': Home,
  'Baño': Bath,
  'Living': Sofa,
  'Pintura': Palette,
  'Fachada': Building,
  'Diseño': Sparkles,
  'default': Home
};

const ServiciosPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('servicios_precios')
        .select('*')
        .eq('activo', true)
        .order('prioridad', { ascending: false });

      if (fetchError) throw fetchError;

      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('No pudimos cargar los servicios. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceIcon = (categoria, servicio) => {
    const searchText = `${categoria} ${servicio}`.toLowerCase();
    
    if (searchText.includes('cocina')) return SERVICE_ICONS.Cocina;
    if (searchText.includes('baño')) return SERVICE_ICONS.Baño;
    if (searchText.includes('living') || searchText.includes('comedor')) return SERVICE_ICONS.Living;
    if (searchText.includes('pintura') || searchText.includes('color')) return SERVICE_ICONS.Pintura;
    if (searchText.includes('fachada') || searchText.includes('exterior')) return SERVICE_ICONS.Fachada;
    if (searchText.includes('diseño') || searchText.includes('interiorismo')) return SERVICE_ICONS.Diseño;
    
    return SERVICE_ICONS.default;
  };

  const formatPrice = (price) => {
    if (!price) return 'Consultar';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Helmet>
        <title>Servicios de Reforma y Diseño con IA | INMEJORA</title>
        <meta 
          name="description" 
          content="Descubre nuestros servicios de reforma, diseño de interiores y renders con IA en Buenos Aires. Cocinas, baños, livings, fachadas y más. Presupuesto gratis." 
        />
        <meta property="og:title" content="Servicios de Reforma y Diseño con IA | INMEJORA" />
        <meta 
          property="og:description" 
          content="Descubre nuestros servicios de reforma, diseño de interiores y renders con IA en Buenos Aires. Cocinas, baños, livings, fachadas y más. Presupuesto gratis." 
        />
        <meta property="og:url" content="https://inmejora.com/servicios" />
        <link rel="canonical" href="https://inmejora.com/servicios" />
      </Helmet>

      <Header />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 md:px-6 mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-block bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold text-[#D4AF37]">
                SERVICIOS PROFESIONALES
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Nuestros Servicios
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Transformamos espacios con diseño profesional, renders con IA y ejecución de primera calidad en Zona Sur Buenos Aires
            </p>
          </motion.div>
        </section>

        {/* Services Grid Section */}
        <section className="container mx-auto px-4 md:px-6 mb-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
              <p className="text-gray-400 text-lg">Cargando servicios...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <Button
                onClick={fetchServices}
                className="bg-[#D4AF37] text-black hover:bg-[#b5952f]"
              >
                Reintentar
              </Button>
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg">No hay servicios disponibles en este momento.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {services.map((service, index) => {
                const IconComponent = getServiceIcon(service.categoria, service.servicio);
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#1a1a1a] border border-gray-800 hover:border-[#D4AF37] rounded-2xl p-6 md:p-8 transition-all duration-300 group cursor-pointer"
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D4AF37]/20 transition-colors">
                      <IconComponent className="w-7 h-7 text-[#D4AF37]" />
                    </div>

                    {/* Category Badge */}
                    {service.categoria && (
                      <span className="inline-block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {service.categoria}
                      </span>
                    )}

                    {/* Service Name */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                      {service.servicio}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
                      {service.descripcion || 'Servicio profesional de reforma y diseño con garantía de calidad.'}
                    </p>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                          Precio referencial
                        </p>
                        <p className="text-xl font-bold text-[#D4AF37]">
                          {formatPrice(service.precio_unitario)}
                          {service.unidad && (
                            <span className="text-sm text-gray-400 ml-1">
                              / {service.unidad}
                            </span>
                          )}
                        </p>
                      </div>
                      
                      <Link to="/cotizador">
                        <Button
                          size="sm"
                          className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all group-hover:shadow-lg group-hover:shadow-[#D4AF37]/20"
                        >
                          Cotizar
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>

                    {/* Additional Info */}
                    {service.tiempo_estimado_horas && (
                      <div className="mt-4 pt-4 border-t border-gray-800/50">
                        <p className="text-xs text-gray-500">
                          Tiempo estimado: {service.tiempo_estimado_horas} horas
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>

        {/* Bottom CTA Section */}
        <section className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border-2 border-[#D4AF37]/50 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                ¿Listo para transformar tu espacio?
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Obtén tu presupuesto gratis en menos de 5 minutos
              </p>

              <Link to="/cotizador">
                <Button
                  size="lg"
                  className="bg-[#D4AF37] text-black hover:bg-[#b5952f] font-bold text-lg px-10 py-7 rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] transition-all duration-300 group"
                >
                  Solicitar Presupuesto Gratis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <p className="text-sm text-gray-500 mt-6">
                Sin compromiso · Respuesta en menos de 24 horas · Asesoramiento personalizado
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ServiciosPage;