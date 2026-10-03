import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hammer, PaintBucket, Droplets, LayoutGrid, Home, Eye, ClipboardList, MapPin, Clock, ArrowRight, ChevronDown, MessageCircle } from 'lucide-react';
import { PRIMARY_CTA, PROMISE } from '@/config/commercial';
import { SERVICES, ZONES, STEPS, FAQS, WORKS } from '@/data/salesContent';

const ICONS = { hammer: Hammer, paint: PaintBucket, drop: Droplets, grid: LayoutGrid, home: Home, eye: Eye, clipboard: ClipboardList };

export const ctaClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--accent-cta))] px-8 py-4 text-lg font-bold text-white hover:bg-[hsl(24_100%_45%)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors';

export const PrimaryCTA = ({ to = '/contacto', className = '', children = PRIMARY_CTA }) => (
  <Link to={to} className={`${ctaClass} ${className}`} data-cta="primary">
    {children} <ArrowRight className="w-5 h-5" aria-hidden="true" />
  </Link>
);

export const PromiseBadge = ({ className = '' }) => (
  <p className={`inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 text-sm font-semibold text-[#f1d675] ${className}`}>
    <Clock className="w-4 h-4" aria-hidden="true" /> {PROMISE.short}*
  </p>
);

export const SalesHero = () => (
  <section className="relative overflow-hidden bg-[#0a0a0a] pt-24 pb-12 md:pt-36 md:pb-24 px-4" aria-labelledby="hero-title">
    <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 25% 20%, #d4af37 0%, transparent 55%)' }} />
    <div className="container mx-auto relative max-w-4xl text-center">
      <p className="text-[#d4af37] text-xs md:text-sm font-semibold tracking-widest uppercase mb-3 md:mb-4">INMEJORA · Reformas y terminaciones</p>
      <h1 id="hero-title" className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
        Reformas y terminaciones en <span className="text-[#d4af37]">Hudson, Berazategui y Quilmes</span>
      </h1>
      <p className="mt-4 md:mt-6 text-base md:text-xl text-gray-300 max-w-2xl mx-auto">
        Remodelaciones, pintura, impermeabilización, pisos y ampliaciones. Contanos tu proyecto y recibí tu presupuesto en 24 a 72 horas.
      </p>
      <div className="mt-6 md:mt-8 flex flex-col items-center gap-3 md:gap-4">
        <PrimaryCTA />
        <PromiseBadge />
      </div>
      <p className="mt-4 text-xs text-gray-500 max-w-xl mx-auto">*{PROMISE.note}</p>
    </div>
  </section>
);

export const ServicesSection = ({ heading = 'Qué podés contratar', intro = 'Elegí el servicio y contanos tu proyecto. Es el primer paso para tu presupuesto.', detailed = false }) => (
  <section id="servicios" className="bg-[#0f0f0f] py-16 md:py-24 px-4" aria-labelledby="servicios-title">
    <div className="container mx-auto max-w-6xl">
      <h2 id="servicios-title" className="text-3xl md:text-4xl font-bold text-white text-center">{heading}</h2>
      <p className="mt-3 text-gray-400 text-center max-w-2xl mx-auto">{intro}</p>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 list-none p-0">
        {SERVICES.map(s => {
          const Icon = ICONS[s.icon] ?? Hammer;
          return (
            <li key={s.slug} id={s.slug} className="rounded-2xl border border-white/10 bg-[#141414] p-6 flex flex-col">
              <Icon className="w-8 h-8 text-[#d4af37]" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold text-white">{s.name}</h3>
              <p className="mt-2 text-gray-300">{detailed ? s.detail : s.short}</p>
              {detailed && (
                <ul className="mt-3 text-sm text-gray-400 list-disc pl-5 space-y-1">
                  {s.ask.map(a => <li key={a}>{a}</li>)}
                </ul>
              )}
              <Link to={`/contacto?servicio=${s.slug}`} className="mt-5 inline-flex items-center gap-1.5 font-semibold text-[#d4af37] hover:text-[#f1d675] focus:outline-none focus-visible:underline" aria-label={`${PRIMARY_CTA}: ${s.name}`}>
                Consultar por {s.name.toLowerCase()} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export const HowItWorks = () => (
  <section id="como-funciona" className="bg-[#0a0a0a] py-16 md:py-24 px-4" aria-labelledby="como-title">
    <div className="container mx-auto max-w-5xl">
      <h2 id="como-title" className="text-3xl md:text-4xl font-bold text-white text-center">Cómo funciona</h2>
      <ol className="mt-10 grid gap-5 md:grid-cols-4 list-none p-0">
        {STEPS.map(step => (
          <li key={step.n} className="rounded-2xl border border-white/10 bg-[#141414] p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4af37] font-black text-black" aria-hidden="true">{step.n}</span>
            <h3 className="mt-4 text-lg font-bold text-white">{step.title}</h3>
            <p className="mt-2 text-sm text-gray-300">{step.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 text-center">
        <p className="text-2xl font-bold text-white">{PROMISE.headline}</p>
        <p className="mt-2 text-sm text-gray-400 max-w-2xl mx-auto">{PROMISE.note}</p>
      </div>
    </div>
  </section>
);

// Renders only with REAL works supplied in WORKS (never stock or AI images).
export const WorksSection = () => {
  if (!WORKS.length) return null;
  return (
    <section id="obras" className="bg-[#0f0f0f] py-16 md:py-24 px-4" aria-labelledby="obras-title">
      <div className="container mx-auto max-w-6xl">
        <h2 id="obras-title" className="text-3xl md:text-4xl font-bold text-white text-center">Obras realizadas</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 list-none p-0">
          {WORKS.map(w => (
            <li key={w.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#141414]">
              <img src={w.image} alt={w.alt} loading="lazy" decoding="async" width="800" height="600" className="aspect-[4/3] w-full object-cover" />
              <div className="p-4"><h3 className="font-bold text-white">{w.title}</h3><p className="text-sm text-gray-400">{w.zone} · {w.service}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export const ZonesSection = () => (
  <section id="zonas" className="bg-[#0f0f0f] py-16 md:py-24 px-4" aria-labelledby="zonas-title">
    <div className="container mx-auto max-w-4xl text-center">
      <h2 id="zonas-title" className="text-3xl md:text-4xl font-bold text-white">¿Trabajan en mi zona?</h2>
      <p className="mt-3 text-gray-300">Nuestro foco inicial es zona sur del GBA. Si estás cerca, consultanos y confirmamos la cobertura.</p>
      <ul className="mt-8 flex flex-wrap justify-center gap-3 list-none p-0">
        {ZONES.map(z => (
          <li key={z.slug}>
            <Link to={`/zonas/${z.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:border-[#d4af37] hover:text-[#d4af37]">
              <MapPin className="w-4 h-4" aria-hidden="true" /> {z.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export const FaqSection = () => {
  const [open, setOpen] = useState(0);
  return (
    <section id="preguntas" className="bg-[#0a0a0a] py-16 md:py-24 px-4" aria-labelledby="faq-title">
      <div className="container mx-auto max-w-3xl">
        <h2 id="faq-title" className="text-3xl md:text-4xl font-bold text-white text-center">Preguntas frecuentes</h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((item, i) => (
            <div key={item.q} className="rounded-xl border border-white/10 bg-[#141414]">
              <h3>
                <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} aria-controls={`faq-${i}`} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] rounded-xl">
                  {item.q} <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              </h3>
              {open === i && <p id={`faq-${i}`} className="px-5 pb-5 text-gray-300">{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FinalCTA = () => (
  <section className="bg-[#0f0f0f] py-16 md:py-24 px-4" aria-labelledby="final-title">
    <div className="container mx-auto max-w-3xl text-center">
      <h2 id="final-title" className="text-3xl md:text-4xl font-bold text-white">Empecemos por tu proyecto</h2>
      <p className="mt-3 text-gray-300">{PROMISE.headline} {PROMISE.note}</p>
      <div className="mt-8"><PrimaryCTA /></div>
    </div>
  </section>
);

export const WhatsappInline = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-[#25D366] hover:underline">
    <MessageCircle className="w-4 h-4" aria-hidden="true" /> {children}
  </a>
);
