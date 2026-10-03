// Pure helpers for the consultation form. No network, no storage: the consultation only reaches INMEJORA
// when the visitor sends the prepared WhatsApp message. Nothing here may claim it was received.
import { SERVICES, TIMING_OPTIONS, serviceBySlug } from '../data/salesContent.js';

const clean = (value, max) =>
  String(value ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, max);

export const LIMITS = Object.freeze({ short: 120, description: 1200 });

export function normalizeConsulta(values = {}) {
  return {
    servicio: clean(values.servicio, 60),
    localidad: clean(values.localidad, LIMITS.short),
    ambiente: clean(values.ambiente, LIMITS.short),
    descripcion: clean(values.descripcion, LIMITS.description),
    medidas: clean(values.medidas, LIMITS.short),
    cuando: clean(values.cuando, 40),
    nombre: clean(values.nombre, 80),
  };
}

export function validateConsulta(values) {
  const v = normalizeConsulta(values);
  const errors = {};
  if (!v.servicio || (v.servicio !== 'no-se' && !serviceBySlug(v.servicio))) errors.servicio = 'Elegí qué querés hacer.';
  if (v.localidad.length < 3) errors.localidad = 'Indicá tu localidad.';
  if (v.descripcion.length < 10) errors.descripcion = 'Contanos brevemente qué necesitás (mínimo 10 letras).';
  return errors;
}

export function buildConsultaMessage(values) {
  const v = normalizeConsulta(values);
  const service = v.servicio === 'no-se' ? 'Todavía no sé / necesito asesoramiento' : serviceBySlug(v.servicio)?.name ?? v.servicio;
  const timing = TIMING_OPTIONS.find(t => t.value === v.cuando)?.label;
  const lines = [
    'Hola, quiero consultar por un proyecto con INMEJORA.',
    `Servicio: ${service}`,
    `Localidad: ${v.localidad}`,
    v.ambiente && `Ambiente o sector: ${v.ambiente}`,
    `Qué necesito: ${v.descripcion}`,
    v.medidas && `Medidas: ${v.medidas}`,
    timing && `Para cuándo: ${timing}`,
    v.nombre && `Mi nombre: ${v.nombre}`,
    'Te mando fotos a continuación.',
  ];
  return lines.filter(Boolean).join('\n');
}

export const SERVICE_OPTIONS = [...SERVICES.map(s => ({ value: s.slug, label: s.name })), { value: 'no-se', label: 'Todavía no sé' }];
