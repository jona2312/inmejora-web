import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { resolveWhatsapp, formatPhone, buildWhatsappUrl, PROMISE, PRIMARY_CTA, COMMERCIAL } from '../../src/config/commercial.js';
import { SERVICES, ZONES, WORKS, FAQS, STEPS } from '../../src/data/salesContent.js';
import { validateConsulta, buildConsultaMessage, normalizeConsulta, LIMITS } from '../../src/utils/consultaMessage.js';

const walk = dir => readdirSync(dir).flatMap(name => {
  const full = path.join(dir, name);
  return statSync(full).isDirectory() ? walk(full) : [full];
});
const read = file => readFileSync(file, 'utf8');
const src = walk('src').filter(f => /\.(jsx?|css)$/.test(f));

test('commercial number: a single configurable setting with a safe fallback', () => {
  assert.equal(resolveWhatsapp('5491139066429'), '5491139066429');
  assert.equal(resolveWhatsapp('+54 9 11 3906-6429'), '5491139066429');
  assert.equal(resolveWhatsapp(''), '5491158300611');
  assert.equal(resolveWhatsapp(undefined), '5491158300611');
  assert.equal(resolveWhatsapp('123'), '5491158300611');
  assert.equal(resolveWhatsapp('1'.repeat(16)), '5491158300611');
  assert.equal(formatPhone('5491139066429'), '+54 9 11 3906-6429');
  assert.equal(formatPhone('5491158300611'), '+54 9 11 5830-0611');
  assert.match(buildWhatsappUrl('Hola ñ & +', '5491139066429'), /^https:\/\/wa\.me\/5491139066429\?text=Hola%20%C3%B1%20%26%20%2B$/);
  assert.equal(buildWhatsappUrl('', '5491139066429'), 'https://wa.me/5491139066429');
  assert.equal(COMMERCIAL.intakeMode, 'whatsapp');
});

test('no WhatsApp number or wa.me literal exists outside the single config', () => {
  for (const file of src) {
    if (file.endsWith(path.join('config', 'commercial.js'))) continue;
    const text = read(file);
    assert.doesNotMatch(text, /549\d{10}/, `${file} hard-codes a phone number`);
    assert.doesNotMatch(text, /5830-?0611|3906-?6429/, `${file} hard-codes a formatted phone`);
    assert.doesNotMatch(text, /wa\.me\/\d/, `${file} hard-codes a wa.me number`);
  }
  assert.doesNotMatch(read('index.html'), /telephone|\d{2}-\d{4}-\d{4}/, 'index.html must not carry a stale phone');
});

test('promise copy is exact and careful', () => {
  assert.equal(PROMISE.headline, 'Tu presupuesto, en 24 a 72 horas.');
  assert.match(PROMISE.note, /desde que tenemos la información necesaria/);
  assert.match(PROMISE.note, /visita o un relevamiento/);
  assert.equal(PRIMARY_CTA, 'Contanos tu proyecto');
});

test('commercial copy makes no forbidden promises', () => {
  const files = ['src/data/salesContent.js', 'src/config/commercial.js', 'src/utils/consultaMessage.js', ...walk('src/components/sales'), 'src/pages/LandingPage.jsx', 'src/pages/ServiciosPage.jsx', 'src/pages/ContactoPage.jsx', 'src/pages/ZonaPage.jsx', 'index.html'];
  const forbidden = [
    [/\$\s?\d|\bARS\b|\bUSD\b|precio fijo|desde \$/i, 'price'],
    [/gratis|gratuit|sin cargo|sin compromiso/i, 'free promise'],
    [/inmediat|al instante|en minutos|segundos/i, 'immediacy'],
    [/garant[ií]/i, 'warranty'],
    [/cerrado autom|precio cerrado/i, 'closed price'],
    [/comienzo inmediato|empezamos hoy|obra en \d+ d/i, 'start/term promise'],
    [/\b\d{2,}\+|\d+\s?% (de|clientes|satisf)|más de \d+|años de experiencia|clientes satisfechos|proyectos (completados|entregados)/i, 'invented metric'],
    [/testimonio|reseñ/i, 'testimonial'],
  ];
  for (const file of files) {
    const text = read(file);
    for (const [re, label] of forbidden) assert.doesNotMatch(text, re, `${file}: ${label}`);
  }
});

test('content integrity: services, zones, real works', () => {
  assert.deepEqual(SERVICES.map(s => s.slug), ['remodelaciones', 'pintura-y-terminaciones', 'impermeabilizacion', 'pisos-y-revestimientos', 'construccion-y-ampliaciones', 'diseno-y-visualizacion', 'presupuestos-y-relevamientos']);
  assert.deepEqual(ZONES.map(z => z.slug), ['berazategui', 'hudson', 'quilmes']);
  assert.equal(new Set(SERVICES.map(s => s.slug)).size, SERVICES.length);
  assert.equal(STEPS.length, 4);
  assert.ok(FAQS.length >= 4);
  // WORKS must contain only real, local, consented photos. Stock/hotlinked/AI images are never allowed.
  for (const work of WORKS) {
    assert.ok(/^\/[^/]/.test(work.image), `work ${work.id} must use a local image`);
    assert.ok(work.alt && work.title && work.zone && work.service);
  }
  assert.match(SERVICES.find(s => s.slug === 'diseno-y-visualizacion').detail, /IA.*ilustrativas/);
});

test('sales pages do not import stock imagery or removed sections', () => {
  for (const file of [...walk('src/components/sales'), 'src/pages/LandingPage.jsx', 'src/pages/ServiciosPage.jsx', 'src/pages/ContactoPage.jsx', 'src/pages/ZonaPage.jsx']) {
    const text = read(file);
    assert.doesNotMatch(text, /unsplash|imagedelivery|pexels|picsum/i, file);
    assert.doesNotMatch(text, /Testimonials|TransformacionesReales|ProyectosDestacados|RegistrationSection|AIAssistantModal/, file);
  }
});

test('consultation: minimal required fields and validation', () => {
  assert.deepEqual(Object.keys(validateConsulta({})).sort(), ['descripcion', 'localidad', 'servicio']);
  assert.deepEqual(validateConsulta({ servicio: 'remodelaciones', localidad: 'Hudson', descripcion: 'Quiero renovar la cocina completa.' }), {});
  assert.deepEqual(validateConsulta({ servicio: 'no-se', localidad: 'Quilmes', descripcion: 'Humedad en el techo del living.' }), {});
  assert.ok(validateConsulta({ servicio: 'inventado', localidad: 'Hudson', descripcion: 'Quiero renovar la cocina.' }).servicio);
  assert.ok(validateConsulta({ servicio: 'remodelaciones', localidad: 'Hu', descripcion: 'Quiero renovar la cocina.' }).localidad);
  assert.ok(validateConsulta({ servicio: 'remodelaciones', localidad: 'Hudson', descripcion: 'corto' }).descripcion);
});

test('consultation message: optional fields omitted, nothing claims delivery', () => {
  const minimal = buildConsultaMessage({ servicio: 'impermeabilizacion', localidad: 'Berazategui', descripcion: 'Filtración en la terraza.' });
  assert.match(minimal, /^Hola, quiero consultar por un proyecto con INMEJORA\./);
  assert.match(minimal, /Servicio: Impermeabilización/);
  assert.match(minimal, /Localidad: Berazategui/);
  assert.doesNotMatch(minimal, /Medidas|Ambiente|Para cuándo|Mi nombre/);
  const full = buildConsultaMessage({ servicio: 'pisos-y-revestimientos', localidad: 'Quilmes', ambiente: 'Living', descripcion: 'Cambiar piso flotante.', medidas: '4 x 5 m', cuando: '1-3-meses', nombre: 'Ana' });
  for (const piece of ['Ambiente o sector: Living', 'Medidas: 4 x 5 m', 'Para cuándo: En 1 a 3 meses', 'Mi nombre: Ana']) assert.ok(full.includes(piece), piece);
  assert.doesNotMatch(full, /enviad|recibid|confirmad/i);
});

test('consultation message: sanitizes control characters and enforces limits', () => {
  const n = normalizeConsulta({ servicio: 'remodelaciones', localidad: 'Hudson\u0000\u0007', descripcion: 'x'.repeat(LIMITS.description + 500), nombre: ' Ana\u001b ' });
  assert.equal(n.localidad, 'Hudson');
  assert.equal(n.descripcion.length, LIMITS.description);
  assert.equal(n.nombre, 'Ana');
  const url = buildWhatsappUrl(buildConsultaMessage({ servicio: 'remodelaciones', localidad: 'Hudson', descripcion: 'y'.repeat(LIMITS.description) }));
  assert.ok(url.length < 4000, 'wa.me URL stays within safe length');
});

test('the form never states that the consultation was sent', () => {
  const form = read('src/components/sales/ConsultaForm.jsx');
  assert.doesNotMatch(form, /(consulta|mensaje) (fue |ha sido )?(enviad|recibid)|gracias por tu consulta|éxito|exitos/i);
  assert.match(form, /Todavía no fue enviado/);
  assert.match(form, /llega a INMEJORA cuando la enviás desde WhatsApp/);
  assert.doesNotMatch(form, /fetch\(|axios|XMLHttpRequest|sendBeacon/);
});

test('robots and sitemap list only commercial pages', () => {
  const sitemap = read('public/sitemap.xml');
  for (const p of ['/', '/servicios', '/contacto', '/zonas/berazategui', '/zonas/hudson', '/zonas/quilmes']) assert.ok(sitemap.includes(`https://inmejora.com${p === '/' ? '/' : p}<`), p);
  for (const p of ['/cotizador', '/precios', '/presupuesto', '/asistente-ia', '/proyectos', '/planes', '/registro']) assert.ok(!sitemap.includes(p), `${p} must not be in the sitemap`);
});
