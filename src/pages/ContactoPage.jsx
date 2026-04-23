import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ContactoPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo a la brevedad.",
      });
      e.target.reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Helmet>
        <title>Contacto | INMEJORA - Reformas y Diseño de Interiores Zona Sur</title>
        <meta name="description" content="Contactá a INMEJORA para tu proyecto de reforma o diseño de interiores en Zona Sur Buenos Aires. Te respondemos en menos de 72 horas." />
        <meta property="og:title" content="Contacto | INMEJORA - Reformas y Diseño de Interiores Zona Sur" />
        <meta property="og:description" content="Contactá a INMEJORA para tu proyecto de reforma o diseño de interiores en Zona Sur Buenos Aires. Te respondemos en menos de 72 horas." />
        <meta property="og:url" content="https://inmejora.com/contacto" />
        <link rel="canonical" href="https://inmejora.com/contacto" />
      </Helmet>
      
      <Header />

      <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactanos</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              ¿Tienes alguna duda o quieres empezar un proyecto? Escríbenos y te responderemos lo antes posible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>
              
              <div className="flex items-start space-x-4">
                <div className="bg-[#d4af37]/10 p-3 rounded-full text-[#d4af37]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Teléfono / WhatsApp</h3>
                  <p className="text-gray-400">+54 9 11 15830061</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#d4af37]/10 p-3 rounded-full text-[#d4af37]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Email</h3>
                  <p className="text-gray-400">info@inmejora.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#d4af37]/10 p-3 rounded-full text-[#d4af37]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Ubicación</h3>
                  <p className="text-gray-400">Buenos Aires, Argentina</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#141414] p-8 rounded-2xl border border-gray-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" required className="bg-gray-900 border-gray-700 text-white" placeholder="Tu nombre" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required className="bg-gray-900 border-gray-700 text-white" placeholder="tu@email.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea id="message" required rows={5} className="bg-gray-900 border-gray-700 resize-none text-white" placeholder="¿En qué te podemos ayudar?" />
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black">
                  {isSubmitting ? "Enviando..." : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactoPage;