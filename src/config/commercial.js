// Single source of truth for the commercial (sales) web: contact channel, promise and launch mode.
// Switching the commercial WhatsApp number is ONE build-time setting: VITE_COMMERCIAL_WHATSAPP.

const DEFAULT_WHATSAPP = '5491158300611'; // temporary number in production today (see docs/sales-launch/PHONE-LINK-MAP.md)

const digits = value => String(value ?? '').replace(/\D/g, '');

export function resolveWhatsapp(raw) {
  const value = digits(raw);
  // International format without "+", 10–15 digits. Anything else falls back to the known-good default.
  return value.length >= 10 && value.length <= 15 ? value : DEFAULT_WHATSAPP;
}

export function formatPhone(number) {
  const match = /^549(11)(\d{4})(\d{4})$/.exec(number);
  return match ? `+54 9 ${match[1]} ${match[2]}-${match[3]}` : `+${number}`;
}

export function buildWhatsappUrl(text, number = COMMERCIAL.whatsapp) {
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const COMMERCIAL = Object.freeze({
  whatsapp: resolveWhatsapp(env.VITE_COMMERCIAL_WHATSAPP),
  email: 'hola@inmejora.com',
  instagram: 'https://www.instagram.com/in_mejora/',
  siteUrl: 'https://inmejora.com',
  // 'whatsapp' = every consultation ends in the commercial WhatsApp channel (the only mode this candidate ships).
  // A future 'core' mode must only be enabled after the production Project Core intake contract is closed.
  intakeMode: 'whatsapp',
  // true: commercial pages only. Account, plans, checkout, catalog and quoter routes are redirected to the consultation funnel.
  // 'false' re-exposes the legacy routes but is NOT a tested rollback path (roll back by redeploying the previous image).
  salesLaunchMode: String(env.VITE_SALES_LAUNCH_MODE ?? 'true') !== 'false',
});

export const PRIMARY_CTA = 'Contanos tu proyecto';

export const PROMISE = Object.freeze({
  headline: 'Tu presupuesto, en 24 a 72 horas.',
  short: 'Presupuesto en 24 a 72 horas',
  note: 'El plazo cuenta desde que tenemos la información necesaria para presupuestar. Si tu trabajo requiere una visita o un relevamiento, te lo informamos durante la consulta.',
});

export const phoneDisplay = () => formatPhone(COMMERCIAL.whatsapp);
export const phoneTelHref = () => `tel:+${COMMERCIAL.whatsapp}`;
