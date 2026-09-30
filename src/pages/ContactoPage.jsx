import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createProjectCoreClient, localCoreEnabled } from '@/lib/projectCoreClient';

const ContactoPage = () => {
  const { toast } = useToast();
  const local = localCoreEnabled();
  const client = useRef(null);
  if (!client.current) client.current = createProjectCoreClient();
  const [context, setContext] = useState(null);
  const [busy, setBusy] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [failure, setFailure] = useState('');
  const inFlight = useRef(false);
  useEffect(() => {
    if (!local) return;
    let active = true;
    client.current.initialize().then(value => {if (active) setContext(value);})
      .catch(() => {if (active) setFailure('No se pudo conectar. Tu proyecto no está confirmado. Podés reintentar sin perder los datos.');});
    return () => {active = false;};
  }, [local]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (local) {
      if (inFlight.current) return;
      inFlight.current = true; setBusy(true); setFailure(''); setAttempted(true);
      const fields = new FormData(e.currentTarget);
      try {
        setContext(await client.current.submit({name: String(fields.get('name')), email: String(fields.get('email')),
          locality: String(fields.get('locality')), message: String(fields.get('message')), consent: fields.get('consent') === 'on'}));
      } catch (error) {
        if (error.status === 422) setAttempted(false);
        setFailure(error.status === 401 ? 'La sesión de solicitud venció. No se confirmó el envío. No se creó otra solicitud automáticamente.' :
          'No se confirmó el proyecto. Conservamos el envío para reintentar sin duplicarlo.');
      } finally {inFlight.current = false; setBusy(false);}
      return;
    }
    toast({
      variant: "destructive",
      title: "Envío no disponible",
      description: "Tu mensaje no fue enviado ni guardado. Podés contactarnos por email o WhatsApp.",
    });
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
                  <p className="text-gray-400">+54 9 11 5830-0611</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-[#d4af37]/10 p-3 rounded-full text-[#d4af37]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Email</h3>
                  <p className="text-gray-400">hola@inmejora.com</p>
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
              {local && <p className="text-amber-300 text-sm mb-4">Prueba local · Usar únicamente datos ficticios.</p>}
              {failure && <p role="alert" className="text-red-300 mb-4">{failure}</p>}
              {context ? <section aria-label="Proyecto confirmado" className="space-y-4 break-words">
                <h2 className="text-xl text-[#d4af37]">Proyecto recibido</h2>
                <p>Tu consulta quedó guardada y un operador puede continuar con el mismo proyecto.</p>
                <dl><dt>Proyecto</dt><dd data-testid="project-id">{context.project_id}</dd>
                  <dt className="mt-3">Conversación</dt><dd data-testid="conversation-id">{context.conversation_id}</dd>
                  <dt className="mt-3">Estado</dt><dd data-testid="project-state">{context.state}</dd></dl>
                <Button type="button" onClick={async () => {try {setContext(await client.current.current()); setFailure('');} catch {setFailure('No se pudo actualizar el contexto del proyecto.');}}}>Actualizar proyecto</Button>
              </section> :
              <form onSubmit={handleSubmit} className="space-y-6">
                {!local && <p role="status" className="text-amber-300 text-sm">El envío desde este formulario está temporalmente no disponible. Tu mensaje no se enviará ni guardará.</p>}
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" name="name" required maxLength={local ? 100 : undefined} readOnly={local && attempted} className="bg-gray-900 border-gray-700 text-white" placeholder="Tu nombre" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required maxLength={local ? 254 : undefined} readOnly={local && attempted} className="bg-gray-900 border-gray-700 text-white" placeholder="tu@email.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea id="message" name="message" required maxLength={local ? 2000 : undefined} readOnly={local && attempted} rows={5} className="bg-gray-900 border-gray-700 resize-none text-white" placeholder="¿En qué te podemos ayudar?" />
                </div>
                
                {local && <><div className="space-y-2"><Label htmlFor="locality">Localidad</Label><Input id="locality" name="locality" required maxLength={120} readOnly={attempted} className="bg-gray-900 border-gray-700 text-white" /></div>
                  <label className="block text-sm"><input name="consent" type="checkbox" required disabled={attempted} className="mr-2" />Solicito contacto por esta consulta (aviso local LOCAL-FIXTURE-1).</label></>}
                <Button type="submit" disabled={busy} className="w-full bg-[#d4af37] hover:bg-[#b5952f] text-black">
                  <Send className="w-4 h-4 mr-2" /> {busy ? 'Enviando…' : local && attempted ? 'Reintentar el mismo envío' : 'Enviar Mensaje'}
                </Button>
              </form>}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactoPage;
