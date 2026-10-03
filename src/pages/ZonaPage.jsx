import React from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import SalesSEO from '@/components/sales/SalesSEO';
import { SalesHeader, SalesFooter } from '@/components/sales/SalesLayout';
import { PrimaryCTA, PromiseBadge, FaqSection } from '@/components/sales/sections';
import { PROMISE } from '@/config/commercial';
import { SERVICES, ZONES, zoneBySlug } from '@/data/salesContent';

const ZonaPage = () => {
  const { slug } = useParams();
  const zone = zoneBySlug(slug);
  if (!zone) return <Navigate to="/servicios" replace />;
  return (
    <div className="relative overflow-x-hidden bg-background text-foreground">
      <SalesSEO
        path={`/zonas/${zone.slug}`}
        title={`${zone.title} | INMEJORA`}
        description={`${zone.intro} ${PROMISE.short} desde que tenemos la información necesaria.`}
      />
      <SalesHeader />
      <main id="main-content" className="pt-16 md:pt-[72px]">
        <section className="bg-[#0a0a0a] px-4 py-14 text-center">
          <h1 className="mx-auto max-w-3xl text-4xl md:text-5xl font-black text-white">{zone.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">{zone.intro}</p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <PrimaryCTA to={`/contacto?zona=${zone.slug}`} />
            <PromiseBadge />
          </div>
          <p className="mx-auto mt-4 max-w-xl text-xs text-gray-500">*{PROMISE.note}</p>
        </section>
        <section className="bg-[#0f0f0f] px-4 py-14" aria-labelledby="zona-servicios">
          <div className="container mx-auto max-w-5xl">
            <h2 id="zona-servicios" className="text-center text-3xl font-bold text-white">Servicios en {zone.name}</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 list-none p-0">
              {SERVICES.map(s => (
                <li key={s.slug} className="rounded-xl border border-white/10 bg-[#141414] p-5">
                  <h3 className="font-bold text-white">{s.name}</h3>
                  <p className="mt-1 text-sm text-gray-300">{s.short}</p>
                  <Link to={`/contacto?servicio=${s.slug}&zona=${zone.slug}`} className="mt-3 inline-block font-semibold text-[#d4af37] hover:text-[#f1d675]">Consultar desde {zone.name}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-gray-400">{zone.note}</p>
            <p className="mt-6 text-center text-sm text-gray-500">
              También atendemos consultas de: {ZONES.filter(z => z.slug !== zone.slug).map((z, i) => (
                <React.Fragment key={z.slug}>{i ? ', ' : ''}<Link className="underline hover:text-[#d4af37]" to={`/zonas/${z.slug}`}>{z.name}</Link></React.Fragment>
              ))}.
            </p>
          </div>
        </section>
        <FaqSection />
      </main>
      <SalesFooter />
    </div>
  );
};

export default ZonaPage;
