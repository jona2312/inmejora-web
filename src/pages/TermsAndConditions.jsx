import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Helmet>
        <title>Términos y Condiciones - INMEJORA</title>
        <meta name="description" content="Leé los términos y condiciones de uso de los servicios y el sitio web de INMEJORA. Al utilizar nuestros servicios, aceptás estos términos." />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-24 pt-32">
        <div className="max-w-4xl mx-auto">
           <Link to="/" className="inline-flex items-center gap-2 text-gold-light hover:text-foreground transition-colors mb-8">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-gold-light via-yellow-500 to-gold-light bg-clip-text text-transparent">Términos y Condiciones</h1>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
            <p>Última actualización: 27 de Noviembre de 2025</p>
            <p>Bienvenido a INMEJORA. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de INMEJORA, ubicado en [URL del sitio web]. Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones. No continúes usando INMEJORA si no estás de acuerdo con todos los términos y condiciones establecidos en esta página.</p>
            
            <h2 className="text-2xl font-semibold text-foreground !mt-12 !mb-4">1. Licencia</h2>
            <p>A menos que se indique lo contrario, INMEJORA y/o sus licenciantes son propietarios de los derechos de propiedad intelectual de todo el material en INMEJORA. Todos los derechos de propiedad intelectual están reservados. Puedes acceder a esto desde INMEJORA para tu propio uso personal sujeto a las restricciones establecidas en estos términos y condiciones.</p>
            <p>No debes:</p>
            <ul>
              <li>Volver a publicar material de INMEJORA</li>
              <li>Vender, alquilar o sublicenciar material de INMEJORA</li>
              <li>Reproducir, duplicar o copiar material de INMEJORA</li>
              <li>Redistribuir contenido de INMEJORA</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground !mt-12 !mb-4">2. Asistente InAI</h2>
            <p>El servicio "Asistente InAI" utiliza inteligencia artificial para generar preproyectos y visualizaciones conceptuales. Estos resultados son una guía inicial y no constituyen planos técnicos o de construcción finales. Las propuestas generadas por IA deben ser revisadas y validadas por nuestro equipo profesional antes de cualquier ejecución de obra. INMEJORA no se hace responsable por interpretaciones o usos de los preproyectos de IA que no hayan sido aprobados por un arquitecto o diseñador de nuestro equipo.</p>
            
            <h2 className="text-2xl font-semibold text-foreground !mt-12 !mb-4">3. Limitación de responsabilidad</h2>
            <p>En la máxima medida permitida por la ley aplicable, excluimos todas las representaciones, garantías y condiciones relacionadas con nuestro sitio web y el uso de este sitio web. Nada en este descargo de responsabilidad:</p>
            <ul>
                <li>limitará o excluirá nuestra o tu responsabilidad por muerte o lesiones personales;</li>
                <li>limitará o excluirá nuestra o tu responsabilidad por fraude o tergiversación fraudulenta;</li>
                <li>limitará cualquiera de nuestras o tus responsabilidades de cualquier manera que no esté permitida por la ley aplicable; o</li>
                <li>excluirá cualquiera de nuestras o tus responsabilidades que no puedan ser excluidas bajo la ley aplicable.</li>
            </ul>

            <p>Si tenés alguna pregunta sobre estos términos, por favor contáctanos en <a href="mailto:hola@inmejora.com" className="text-gold-light hover:underline">hola@inmejora.com</a>.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;