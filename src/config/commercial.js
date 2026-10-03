// Single source of truth for the commercial (sales) web: contact channel, promise and launch mode.
// Switching the commercial WhatsApp number is ONE build-time setting: VITE_COMMERCIAL_WHATSAPP.

// Fail-closed: there is NO production fallback number. A production build without a valid VITE_COMMERCIAL_WHATSAPP
// fails (see vite.config.js) and, if one ever slipped through, the commercial channel renders disabled instead of
// sending consultations to a provisional number. The placeholder below is used ONLY by `vite dev` and unit tests.
const DEV_ONLY_WHATSAPP = '5491100000000';

const digits = value => String(value ?? '').replace(/\D/g, '');

/** International format without "+", 10-15 digits. Returns '' when missing or invalid. */
export function validWhatsapp(raw) {
  const value = digits(raw);
  return value.length >= 10 && value.length <= 15 ? value : '';
}

/** mode: Vite mode. Only development (and mode-less unit tests) may use the placeholder; every other mode is strict. */
export function resolveWhatsapp(raw, mode) {
  const value = validWhatsapp(raw);
  if (value) return value;
  return mode === undefined || mode === 'development' ? DEV_ONLY_WHATSAPP : '';
}

export function formatPhone(number) {
  const match = /^549(11)(\d{4})(\d{4})$/.exec(number);
  if (!number) return '';
  return match ? `+54 9 ${match[1]} ${match[2]}-${match[3]}` : `+${number}`;
}

export function buildWhatsappUrl(text, number = COMMERCIAL.whatsapp) {
  if (!number) return null; // channel disabled: never build a link to an unknown number
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const COMMERCIAL = Object.freeze({
  whatsapp: resolveWhatsapp(env.VITE_COMMERCIAL_WHATSAPP, env.MODE),
  // false => the consultation channel is explicitly disabled (no wa.me links, no phone, form submit disabled).
  channelEnabled: Boolean(resolveWhatsapp(env.VITE_COMMERCIAL_WHATSAPP, env.MODE)),
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
export const phoneTelHref = () => (COMMERCIAL.whatsapp ? `tel:+${COMMERCIAL.whatsapp}` : '');
