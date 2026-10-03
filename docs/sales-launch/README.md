# INMEJORA Web — Sales Launch Candidate

Branch `claude/web-sales-launch-candidate`, based on #20 (`14f1894ec2091497668b6a5c8609ef7fc36406f3`). **No deploy.** No Project Core, no Dashboard, no Codex branch touched. No new backend: every consultation ends in the commercial WhatsApp channel, which the visitor sends manually.

**`WEB_SALES_LAUNCH_CANDIDATE = READY` (technical)** — all 12 criteria below pass. **Publication is blocked** by the decisions in "Blockers for publishing"; none of them is a code defect.

## What the visitor gets
Home → `Reformas y terminaciones en Hudson, Berazategui y Quilmes`, the 7 services, how it works, **Tu presupuesto, en 24 a 72 horas.\*** (with the clarification), zones, FAQ, one CTA: **Contanos tu proyecto**. The CTA opens a minimal form (service, locality, description required; room, measures, timing, name optional) that prepares the WhatsApp message. The page never says the consultation was sent: *"Preparamos tu mensaje. Todavía no fue enviado."*

## Definition of done
| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | Home sells the services clearly | PASS | `sales.spec` "home sells the offer"; screenshots `home-*`, `fold-home-*` |
| 2 | Services understandable | PASS | `/servicios` (what we need to know per service), 7 cards on home |
| 3 | Main CTA works | PASS | every `[data-cta=primary]` reads "Contanos tu proyecto" → `/contacto`; service/zone CTAs prefill the form |
| 4 | Mobile works | PASS | browser suite at 360, 390, 412, 768, 1440: no horizontal overflow, menu with Escape/focus, form, CTA above the fold at 360×740 |
| 5 | Contact never shows false success | PASS | `sales.spec` "form validates, and never claims delivery"; `sales-launch.test` forbids sent/received wording and any `fetch`/`axios` in the form |
| 6 | 24–72 h explained correctly | PASS | hero, how-it-works, final CTA, form, footer, zones: always with "desde que tenemos la información necesaria" and "si requiere visita o relevamiento, te lo informamos durante la consulta" |
| 7 | No false prices/promises | PASS | `sales-launch.test` scans copy for prices, "gratis/sin cargo/sin compromiso", immediacy, warranty, invented metrics, testimonials; rendered-text scan in the browser |
| 8 | Links and phones inventoried | PASS | `CTA-AND-PHONE-MAP.md`, `link-inventory.json`; browser test fails on any dead/placeholder/unknown link or stale number |
| 9 | 6429 with one setting | PASS | build arg `VITE_COMMERCIAL_WHATSAPP`; verified by building with `5491139066429` (see below) |
| 10 | Web sells without Project Core | PASS | no backend call; `intakeMode: 'whatsapp'`; the form has no Core/Supabase dependency |
| 11 | Tests / lint / build / browser | PASS | see `TEST-EVIDENCE.md` |
| 12 | Dashboard / Core untouched | PASS | diff touches only this repo's Web files |

## Switching to 6429 (single change)
Set the build variable (Coolify: *Build Variable*, "available at build time") and redeploy:

```
VITE_COMMERCIAL_WHATSAPP=<country code + number, digits only>
```
Everything follows from it: every `wa.me` link, the floating button, footer phone and `tel:` link, and the JSON-LD `telephone`. A test fails if a number is hard-coded anywhere else. Without the variable (or if invalid) the site falls back to the **current production number** (`+54 9 11 5830-0611`), so a missing build arg never produces a broken link — but it also never switches silently. **After deploy, check the footer phone on `/contacto`.**

Proof: building with `VITE_COMMERCIAL_WHATSAPP=5491139066429` leaves that number in the bundle, and the previous number only as the documented fallback constant. The earlier site metadata listed `+54 9 11 3906-6429` as the business phone, so I assume the 6429 number is `5491139066429` — **Jona must confirm the full number**.

## What changed (summary)
- New commercial layer: `src/config/commercial.js` (number, promise, mode), `src/data/salesContent.js` (services, zones, steps, FAQ, real works), `src/components/sales/*`, pages Home/Servicios/Contacto + `/zonas/{berazategui,hudson,quilmes}`.
- Removed from the commercial surface: AI-first sections, stock "Proyectos/Transformaciones reales", the registration form on the home, testimonials (already hidden), proveedores CTA, "Probá gratis" and similar. `/nosotros` redirects to `/` (its stats, names and "matriculados" claims were not verifiable).
- **Sales launch mode** (`VITE_SALES_LAUNCH_MODE`, default on): `/precios /planes /cotizador /presupuesto /asistente-ia /registro /catalogo* /proyectos /nosotros /checkout/*` redirect to `/contacto`, `/servicios` or `/` before any legacy page mounts. Portal, login, proveedores and admin routes are untouched and unlinked (future authenticated portal). The flag set to `false` is **not** a tested rollback; roll back by redeploying the previous image.
- Phones: 14 hard-coded `wa.me`/phone literals now come from the config.
- SEO: unique title/description/canonical per page, LocalBusiness JSON-LD generated from the config (no `priceRange`), sitemap with commercial pages only, zone pages, duplicate meta tags fixed (static tags are removed once Helmet renders), new OG image, manifest without broken screenshot references.
- Cookie banner compacted on mobile (it covered ~55% of the first screen).

## Blockers for publishing (decisions/inputs, not code)
1. **6429 must be Connected and operational** (your gate) and the full number confirmed.
2. **Real works**: the home section "Obras realizadas" is built but hidden because `WORKS` is empty. There are no verified real photos in the repo; the old "Proyectos/Transformaciones" used stock images presented as real work and were removed. Provide real photos with the client's consent (item shape documented in `src/data/salesContent.js`). Never use AI/stock images there.
3. **Copy approval** (Jona): hero text, services descriptions (what we can really do; "Construcción y ampliaciones" and "Diseño y visualización" most of all), the FAQ answer about AI, the zones wording ("confirmamos la cobertura").
4. **Analytics vs. consent**: `index.html` loads Google Analytics and Microsoft Clarity unconditionally; the cookie banner's "Solo esenciales" does not stop them (pre-existing). Decide whether to gate them on consent before promoting traffic (Ley 25.326 wording is in the banner).
5. **Business data removed from structured data**: the previous JSON-LD carried legal name, tax ID, a street address and a founder name (the founder name differed from the one on `/nosotros`). I did not carry them over. Re-add only what Jona confirms.
6. **Visit/relevamiento wording** and **"Parte del grupo INB"** (removed from the footer) need an owner decision.
7. **Project Core intake** remains HOLD and is intentionally not used. When its production contract closes, a `core` intake mode can be added behind `COMMERCIAL.intakeMode` without touching the pages.

## Minor / later
- `favicon.ico` is referenced but not shipped (pre-existing). Main JS chunk is ~600 kB (186 kB gzip), unchanged in nature from the baseline; vendor splitting is a later optimization. Server-side prerendering would improve first-crawl SEO (pages render client-side with correct meta via Helmet).
- A health ping to the Dashboard API still runs on page load (pre-existing global provider); it is a GET and does not affect the commercial flow.
- One node test (`admin-route`) failed once in a combined run and passed on rerun (3×, plus 81/81 twice); likely timing under load, not related to this change.
