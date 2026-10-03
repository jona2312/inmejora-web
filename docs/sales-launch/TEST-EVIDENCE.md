# Test evidence (2026-10-03)

Baseline #20 first, same machine: lint 0 errors / 8 warnings, `test:ci` 70/70, build OK. `npm run build:ci` is a **synthetic** build (placeholder number): never deploy its output.
Candidate:

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | 0 errors, 8 warnings (the same 8 pre-existing `exhaustive-deps` warnings as the baseline) |
| Unit/contract | `npm run test:ci` | **86/86 PASS** (70 baseline + 16 new: `sales-launch.test.mjs`, `whatsapp-fail-closed.test.mjs`) |
| Build | `npm run build:ci` | OK |
| Browser (Microsoft Edge/Chromium, isolated, no external network) | `PW_CHANNEL=msedge npx playwright test` | **315 passed, 55 skipped** across 360 / 390 / 412 / 768 / 1440 px (includes `analytics-consent.spec`) |
| Fail-closed browser variant | `CI_COMMERCIAL_WHATSAPP= CI_OUT_DIR=dist-failclosed npm run build:ci` then `DIST_DIR=dist-failclosed PW_CHANNEL=msedge npx playwright test fail-closed.spec.mjs` | **5/5 PASS** (channel disabled everywhere; no `wa.me`/`tel:`/phone/JSON-LD telephone) |
| Production build gate | `tests/ci/whatsapp-fail-closed.test.mjs` (real `vite build --mode production`) | missing / empty / invalid number → **build fails**, no artifact; valid number → builds, provisional number absent from every bundle |

The 55 skipped are the fail-closed spec (it only runs against its own variant, 5 viewports) and the legacy tests for pages that are now redirected (registration, plans, quoter, catalog, presupuesto, old contact dialog, home registration form). They are skipped, not deleted; they still document those pages' containment behaviour. Route, identity-containment and admin tests keep running.

## What the new tests assert
- `tests/ci/sales-launch.test.mjs`: configurable number, fail-closed outside development, provisional number absent from source; **no phone/`wa.me` literal outside the config**; exact promise copy; copy free of prices, "gratis/sin cargo/sin compromiso", immediacy, warranty, invented metrics and testimonials; real-works list can only hold local images; no stock imagery or removed sections on sales pages; form validation and message building (optional fields omitted, control characters stripped, length limits); the form never says "enviada/recibida" and has no network call; sitemap contains only commercial pages.
- `tests/browser/sales.spec.mjs` (per viewport): 8 pages render without horizontal overflow, console errors, uncaught exceptions or **any non-GET request**; home shows the 7 services and the promise, with only "Contanos tu proyecto" as primary CTA and no price/testimonial text; CTA → form; service and zone prefill; empty submit shows errors and focuses; valid submit opens exactly one `wa.me/<number>?text=…` (intercepted) with all fields and shows "Todavía no fue enviado"; floating WhatsApp present except on `/contacto`; desktop nav / mobile menu with Escape + focus return; home anchors from other pages; 10 legacy URLs redirect without calling legacy backends; unknown zone falls back; link and phone inventory; SEO (single h1, title, one description, one canonical, JSON-LD with the configured phone, no `priceRange`).
- The isolated harness blocks all external hosts; the browser never reached WhatsApp (`window.open` is captured).

- `tests/browser/analytics-consent.spec.mjs`: first visit and "Solo esenciales" load **no** Google Analytics/Clarity request (also after reload and navigation); "Aceptar todo" loads both and restores them on the next visit without asking again; blocked storage counts as no consent.
- `tests/browser/fail-closed.spec.mjs`: see above.

## Screenshots (`docs/sales-launch/screenshots`)
`home-{360,412,1440}`, `servicios-{360,1440}`, `contacto-{360,1440}`, `contacto-preparada-{360,1440}` (message prepared, not sent), `zona-hudson-{360,1440}`, `privacidad-360`, `fold-home-{360,390}` (CTA above the fold), `firstvisit-{home,contacto}-{360,412}` (with the cookie banner). Full-page captures show the fixed header mid-page; that is a capture artifact. All 45 captures are regenerated with `SHOTS=1`.

## Reproduce
```
npm ci
npm run lint && npm run test:ci && npm run build:ci
PW_CHANNEL=msedge npx playwright test            # omit PW_CHANNEL if Playwright's Chromium is installed
SHOTS=1 PW_CHANNEL=msedge npx playwright test sales.spec.mjs   # refresh screenshots + link inventory
```
`PW_CHANNEL` is a small addition to `tests/browser/isolation.mjs` (optional; default behaviour unchanged).

## Not verified here
Real WhatsApp delivery (the number is not Connected), real devices, production hosting/headers, search-engine rendering, load testing.
