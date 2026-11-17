import React from 'react';
import SalesSEO from '@/components/sales/SalesSEO';
import { SalesHeader, SalesFooter } from '@/components/sales/SalesLayout';
import ConsultaForm from '@/components/sales/ConsultaForm';
import { PRIMARY_CTA } from '@/config/commercial';

const ContactoPage = () => (
  <div className="relative overflow-x-hidden bg-background text-foreground">
    <SalesSEO
      path="/contacto"
      title="Contanos tu proyecto | INMEJORA"
      description="Contanos qué querés hacer, tu localidad y para cuándo. El formulario indica el canal disponible y confirma si tu consulta quedó guardada. Revisión inicial humana en un plazo objetivo de 24 a 72 horas corridas desde que el responsable humano confirme que tenemos la información necesaria."
    />
    <SalesHeader />
    <main id="main-content" className="px-4 pt-28 pb-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-white">{PRIMARY_CTA}</h1>
        <p className="mt-3 mb-8 text-gray-300">Contanos lo necesario para entender tu proyecto. Revisá el estado de tu consulta antes de salir.</p>
        <ConsultaForm />
      </div>
    </main>
    <SalesFooter />
  </div>
);

export default ContactoPage;
