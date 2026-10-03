// Fire-and-forget analytics. Never throws, never blocks, never reports a "lead" (a consultation is only prepared here).
export function track(name, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params);
  } catch {
    /* analytics must never break the page */
  }
}
