// Analytics are OFF until the visitor accepts them. "Solo esenciales" (or no choice yet) never loads Google Analytics
// or Microsoft Clarity. This is deliberately not a CMP: one stored choice, one loader.
export const CONSENT_KEY = 'inmejora_cookie_consent';
export const GA_ID = 'G-YRGYGVND3E';
export const CLARITY_ID = 'wexia9sgu8';

let loaded = false;

export function hasAnalyticsConsent() {
  try {
    return globalThis.localStorage?.getItem(CONSENT_KEY) === 'all';
  } catch {
    return false; // storage blocked: treat as no consent
  }
}

function addScript(src) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

/** Loads GA + Clarity once. Call only after consent. Idempotent. */
export function enableAnalytics() {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  // Clarity bootstrap (same queue shim the vendor snippet defines)
  window.clarity = window.clarity || function clarity() { (window.clarity.q = window.clarity.q || []).push(arguments); };
  addScript(`https://www.clarity.ms/tag/${CLARITY_ID}`);
}

/** Run once at startup: restores analytics only if the visitor already accepted them. */
export function initAnalyticsFromConsent() {
  if (hasAnalyticsConsent()) enableAnalytics();
}
