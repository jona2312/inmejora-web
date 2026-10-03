import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Mail, Phone, MessageCircle } from 'lucide-react';
import { COMMERCIAL, PRIMARY_CTA, PROMISE, buildWhatsappUrl, phoneDisplay, phoneTelHref } from '@/config/commercial';
import { ZONES } from '@/data/salesContent';

const NAV = [
  { name: 'Servicios', to: '/servicios' },
  { name: 'Cómo funciona', to: { pathname: '/', hash: '#como-funciona' } },
  { name: 'Zonas', to: { pathname: '/', hash: '#zonas' } },
  { name: 'Preguntas', to: { pathname: '/', hash: '#preguntas' } },
];

export const SalesHeader = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const button = useRef(null);
  useEffect(() => { setOpen(false); }, [location.key]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => { if (e.key === 'Escape') { setOpen(false); button.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const linkClass = 'text-white hover:text-[#d4af37] font-medium focus:outline-none focus-visible:underline';
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 md:h-[72px] border-b border-white/10 bg-[#0f0f0f]/95 backdrop-blur-md">
      <div className="container mx-auto flex h-full items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-baseline text-2xl md:text-3xl font-black tracking-tight text-white" aria-label="INMEJORA, ir al inicio">
          IN<span className="ml-0.5 text-[#d4af37]">MEJORA</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-8" aria-label="Principal">
          {NAV.map(item => <Link key={item.name} to={item.to} className={linkClass}>{item.name}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/contacto" className="hidden sm:inline-flex rounded-full bg-[hsl(var(--accent-cta))] px-5 py-2.5 text-sm font-bold text-white hover:bg-[hsl(24_100%_45%)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white" data-cta="header">
            {PRIMARY_CTA}
          </Link>
          <button ref={button} type="button" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} aria-controls="mobile-navigation" className="lg:hidden rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-navigation" aria-label="Principal móvil" className="lg:hidden absolute inset-x-0 top-16 border-t border-white/10 bg-[#0f0f0f] px-6 py-6 shadow-2xl">
          <ul className="flex flex-col gap-1 list-none p-0 m-0">
            {NAV.map(item => <li key={item.name}><Link to={item.to} className="block rounded-lg py-3 text-lg text-gray-100 hover:bg-white/5 hover:text-[#d4af37]">{item.name}</Link></li>)}
            <li className="pt-3">
              <Link to="/contacto" className="flex justify-center rounded-full bg-[hsl(var(--accent-cta))] px-6 py-3.5 text-lg font-bold text-white" data-cta="header-mobile">{PRIMARY_CTA}</Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export const SalesFooter = () => (
  <footer className="border-t border-white/10 bg-[#0a0a0a] px-4 pt-14 pb-8">
    <div className="container mx-auto grid gap-10 md:grid-cols-4">
      <div>
        <p className="text-3xl font-black tracking-tight text-white">IN<span className="text-[#d4af37]">MEJORA</span></p>
        <p className="mt-3 max-w-xs text-sm text-gray-400">Reformas y terminaciones en zona sur del GBA. {PROMISE.short}*</p>
        <a href={COMMERCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de INMEJORA" className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:border-[#d4af37] hover:text-[#d4af37]"><Instagram className="w-5 h-5" /></a>
      </div>
      <nav aria-label="Servicios y zonas">
        <p className="font-bold text-white">Servicios</p>
        <ul className="mt-4 space-y-3 list-none p-0 text-gray-400">
          <li><Link to="/servicios" className="hover:text-[#d4af37]">Todos los servicios</Link></li>
          {ZONES.map(z => <li key={z.slug}><Link to={`/zonas/${z.slug}`} className="hover:text-[#d4af37]">Reformas en {z.name}</Link></li>)}
        </ul>
      </nav>
      <div>
        <p className="font-bold text-white">Contacto</p>
        <ul className="mt-4 space-y-3 list-none p-0 text-gray-400">
          <li><a href={buildWhatsappUrl('Hola, quiero consultar por un proyecto con INMEJORA.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#d4af37]"><MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp</a></li>
          <li><a href={phoneTelHref()} className="inline-flex items-center gap-2 hover:text-[#d4af37]"><Phone className="w-4 h-4" aria-hidden="true" /> {phoneDisplay()}</a></li>
          <li><a href={`mailto:${COMMERCIAL.email}`} className="inline-flex items-center gap-2 hover:text-[#d4af37]"><Mail className="w-4 h-4" aria-hidden="true" /> {COMMERCIAL.email}</a></li>
        </ul>
      </div>
      <nav aria-label="Legal">
        <p className="font-bold text-white">Legal</p>
        <ul className="mt-4 space-y-3 list-none p-0 text-gray-400">
          <li><Link to="/politica-de-privacidad" className="hover:text-[#d4af37]">Política de privacidad</Link></li>
          <li><Link to="/terminos-y-condiciones" className="hover:text-[#d4af37]">Términos y condiciones</Link></li>
        </ul>
      </nav>
    </div>
    <div className="container mx-auto mt-10 border-t border-white/10 pt-6 text-xs text-gray-500">
      <p>*{PROMISE.note}</p>
      <p className="mt-2">© 2026 INMEJORA. Las imágenes generadas con IA son ilustrativas y se identifican como tales.</p>
    </div>
  </footer>
);

export const SalesWhatsAppButton = () => {
  const location = useLocation();
  if (location.pathname === '/contacto') return null; // the consultation page already has its own WhatsApp step
  return (
    <a href={buildWhatsappUrl('Hola, quiero consultar por un proyecto con INMEJORA.')} target="_blank" rel="noopener noreferrer" aria-label="Escribinos por WhatsApp" data-cta="whatsapp-float" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-bold text-black shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
      <MessageCircle size={26} aria-hidden="true" /><span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
};
