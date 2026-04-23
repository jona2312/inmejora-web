import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Política de Privacidad - INMEJORA</title>
        <meta name="description" content="Conocé cómo INMEJORA protege y gestiona tus datos personales. Nuestra política de privacidad detalla el uso de la información que compartís con nosotros." />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-24 pt-32">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gold-light hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-gold-light via-yellow-500 to-gold-light bg-clip-text text-transparent">Política de Privacidad</h1>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p>Última actualización: 27 de Noviembre de 2025</p>
            <p>En INMEJORA ("nosotros", "nuestro"), respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política de privacidad te informará sobre cómo cuidamos tus datos personales cuando visitas nuestro sitio web (independientemente de dónde lo visites) y te informará sobre tus derechos de privacidad y cómo la ley te protege.</p>
            
            <h2 className="text-2xl font-semibold text-foreground !mt-12 !mb-4">1. Información que recopilamos</h2>
            <p>Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre vos, que hemos agrupado de la siguiente manera:</p>
            <ul>
              <li><strong>Datos de Identidad:</strong> incluye nombre, apellido, nombre de usuario o identificador similar.</li>
              <li><strong>Datos de Contacto:</strong> incluye dirección de correo electrónico y números de teléfono.</li>
              <li><strong>Datos Técnicos:</strong> incluye la dirección del protocolo de Internet (IP), tus datos de inicio de sesión, el tipo y la versión del navegador, la configuración de la zona horaria y la ubicación, los tipos y versiones de los complementos del navegador, el sistema operativo y la plataforma, y otra tecnología en los dispositivos que utilizas para acceder a este sitio web.</li>
              <li><strong>Datos de Uso:</strong> incluye información sobre cómo utilizas nuestro sitio web, productos y servicios.</li>
              <li><strong>Datos de Marketing y Comunicaciones:</strong> incluye tus preferencias para recibir marketing de nuestra parte y de terceros y tus preferencias de comunicación.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground !mt-12 !mb-4">2. Cómo usamos tus datos personales</h2>
            <p>Usaremos tus datos personales solo cuando la ley nos lo permita. Generalmente, usaremos tus datos personales en las siguientes circunstancias:</p>
            <ul>
                <li>Para registrarte como nuevo cliente.</li>
                <li>Para procesar y entregar tu pedido, incluyendo la gestión de pagos, tarifas y cargos.</li>
                <li>Para gestionar nuestra relación con vos, lo que incluirá notificarte sobre cambios en nuestros términos o política de privacidad.</li>
                <li>Para administrar y proteger nuestro negocio y este sitio web (incluyendo la resolución de problemas, el análisis de datos, las pruebas, el mantenimiento del sistema, el soporte, la presentación de informes y el alojamiento de datos).</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground !mt-12 !mb-4">3. Seguridad de los datos</h2>
            <p>Hemos implementado medidas de seguridad apropiadas para evitar que tus datos personales se pierdan accidentalmente, se usen o se acceda a ellos de forma no autorizada, se alteren o se divulguen. Además, limitamos el acceso a tus datos personales a aquellos empleados, agentes, contratistas y otros terceros que tienen una necesidad comercial de conocerlos.</p>

            <h2 className="text-2xl font-semibold text-foreground !mt-12 !mb-4">4. Tus derechos legales</h2>
            <p>Bajo ciertas circunstancias, tenés derechos bajo las leyes de protección de datos en relación con tus datos personales, incluyendo el derecho a solicitar acceso, corrección, eliminación, restricción, transferencia, a oponerte al procesamiento, a la portabilidad de los datos y (donde el fundamento legal del procesamiento es el consentimiento) a retirar el consentimiento.</p>
            
            <p>Si tenés alguna pregunta sobre esta política de privacidad, por favor contáctanos en <a href="mailto:hola@inmejora.com" className="text-gold-light hover:underline">hola@inmejora.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;