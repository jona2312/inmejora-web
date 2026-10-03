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
      description="Contanos qué querés hacer, tu localidad y para cuándo. Armamos tu consulta y la enviás por WhatsApp. Presupuesto en 24 a 72 horas desde que tenemos la información necesaria."
    />
    <SalesHeader />
    <main id="main-content" className="px-4 pt-28 pb-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-black text-white">{PRIMARY_CTA}</h1>
        <p className="mt-3 mb-8 text-gray-300">Completá lo mínimo para entender tu proyecto. Lleva un minuto.</p>
        <ConsultaForm />
      </div>
    </main>
    <SalesFooter />
  </div>
);

export default ContactoPage;
