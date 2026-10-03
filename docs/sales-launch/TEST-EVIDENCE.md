# Test evidence (2026-10-03)

Baseline #20 first, same machine: lint 0 errors / 8 warnings, `test:ci` 70/70, build OK.
Candidate:

| Gate | Command | Result |
|---|---|---|
| Lint | `npm run lint` | 0 errors, 8 warnings (the same 8 pre-existing `exhaustive-deps` warnings as the baseline) |
| Unit/contract | `npm run test:ci` | **81/81 PASS** (70 baseline + 11 new in `tests/ci/sales-launch.test.mjs`) |
| Build | `npm run build:ci` | OK |
| Browser (Microsoft Edge/Chromium, isolated, no external network) | `PW_CHANNEL=msedge npx playwright test` | **295 passed, 50 skipped** across 360 / 390 / 412 / 768 / 1440 px |
| Phone switch | build with `VITE_COMMERCIAL_WHATSAPP=5491139066429` | new number in bundle; old number only as fallback constant |

The 50 skipped are the legacy tests for pages that are now redirected (registration, plans, quoter, catalog, presupuesto, old contact dialog, home registration form). They are skipped, not deleted; they still document those pages' containment behaviour. Route, identity-containment and admin tests keep running.

## What the new tests assert
- `tests/ci/sales-launch.test.mjs`: configurable number and fallback; **no phone/`wa.me` literal outside the config**; exact promise copy; copy free of prices, "gratis/sin cargo/sin compromiso", immediacy, warranty, invented metrics and testimonials; real-works list can only hold local images; no stock imagery or removed sections on sales pages; form validation and message building (optional fields omitted, control characters stripped, length limits); the form never says "enviada/recibida" and has no network call; sitemap contains only commercial pages.
- `tests/browser/sales.spec.mjs` (per viewport): 8 pages render without horizontal overflow, console errors, uncaught exceptions or **any non-GET request**; home shows the 7 services and the promise, with only "Contanos tu proyecto" as primary CTA and no price/testimonial text; CTA → form; service and zone prefill; empty submit shows errors and focuses; valid submit opens exactly one `wa.me/<number>?text=…` (intercepted) with all fields and shows "Todavía no fue enviado"; floating WhatsApp present except on `/contacto`; desktop nav / mobile menu with Escape + focus return; home anchors from other pages; 10 legacy URLs redirect without calling legacy backends; unknown zone falls back; link and phone inventory; SEO (single h1, title, one description, one canonical, JSON-LD with the configured phone, no `priceRange`).
- The isolated harness blocks all external hosts; the browser never reached WhatsApp (`window.open` is captured).

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
