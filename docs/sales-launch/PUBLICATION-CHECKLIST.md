# Publication checklist — inmejora.com sales launch

Run top to bottom. **Stop at the first failed item** and use the rollback at the end. Nothing here is automated; each line needs a named person and evidence (screenshot, command output or timestamp). Do not publish before every box in sections 1–3 is ticked.

Owners: **J** = Jona · **A** = ARKOS · **X** = whoever operates hosting (Coolify).

## 1. Before building
- [ ] **6429 full number confirmed (J).** International format, digits only. The earlier site metadata suggests `5491139066429` (`+54 9 11 3906-6429`); confirm or correct. Evidence: the number written in the release ticket, checked against the SIM/WhatsApp Business profile.
- [ ] **6429 is Connected and operational (J/A).** Evolution instance shows connected, and a message sent *to* that number from a different phone arrives where the team will read it. This is the gate: do not publish a CTA to a number that is not receiving.
- [ ] Copy approved by J (hero, services descriptions, FAQ answer about AI, zones wording) and the real-works decision taken (publish without the "Obras" section, or provide real photos with client consent — see `src/data/salesContent.js`).
- [ ] Previous production image/digest recorded (needed for rollback): `____________________`.

## 2. Configure and build (X)
- [ ] Set the **build variable** `VITE_COMMERCIAL_WHATSAPP=<number from 1>` (Coolify: Build Variable / "available at build time", not a runtime variable). Leave `VITE_SALES_LAUNCH_MODE` unset (default = sales mode).
- [ ] Build from the approved commit. **The build must succeed.** If it fails with `COMMERCIAL_WHATSAPP_REQUIRED`, the variable is missing or invalid — fix it; do not work around it. (There is deliberately no fallback number.)
- [ ] Never deploy output from `npm run build:ci` (synthetic placeholder number).
- [ ] Deploy to a **preview/staging URL first** if the hosting allows it; otherwise continue to section 3 immediately after the production deploy and be ready to roll back.

## 3. Verify on the deployed site (J or X, phone + desktop)
- [ ] **Footer**: open `/contacto`; the footer phone equals the number from 1 (`+54 9 11 xxxx-xxxx`) and the `tel:` link dials it. If the footer shows no phone, or the form says "Por el momento no podemos recibir consultas", the build had no number → roll back.
- [ ] **CTA**: on `/`, every "Contanos tu proyecto" button leads to `/contacto`; a service card ("Consultar por …") opens `/contacto?servicio=…` with the service preselected; a zone page (`/zonas/hudson`) prefills the locality.
- [ ] **wa.me**: fill the form with a harmless test, press "Continuar por WhatsApp". WhatsApp opens to **the 6429 number** with the prepared message. Check the number in the chat header. The page must say "Todavía no fue enviado". **Send that one test message (J)** and confirm it is received by the team. Floating WhatsApp button (all pages except `/contacto`) opens the same number.
- [ ] **Mobile smoke** on a real phone (Android Chrome and iPhone Safari if possible), widths ≈ 360–430: menu opens/closes, CTA visible without scrolling after accepting cookies, form usable with the keyboard open, no horizontal scroll, WhatsApp opens the app.
- [ ] **Links**: footer legal links, Instagram, `mailto:hola@inmejora.com`, 3 zone pages and `/servicios` load; an old URL (`/precios`, `/cotizador`, `/presupuesto`) lands on `/contacto`.
- [ ] **Production headers** (`curl -sI https://inmejora.com/` and `/assets/<any>.js`). The container's nginx config (`nginx.conf`) sets **no** security headers; check what the platform/proxy adds and record it. Expected at minimum: HTTPS with valid certificate and HTTP→HTTPS redirect, `Content-Type` + gzip on JS/CSS, `Cache-Control: public, immutable` on hashed assets, and `index.html` **not** cached long-term. Absent: HSTS, `X-Content-Type-Options`, frame protection, CSP. Missing headers are a decision for A (they are not part of this change); write down the decision. Note `og-image.jpg` and icons are served with the 1-year immutable rule by nginx: social platforms may keep the old preview image until their cache refreshes.
- [ ] **Analytics consent** (use a private window, DevTools → Network):
  - first visit: banner shown, **no** request to `googletagmanager.com` or `clarity.ms`;
  - "Solo esenciales": still none, after reload and on other pages (`localStorage.inmejora_cookie_consent = essential`);
  - clear site data → "Aceptar todo": both load; reload: they load again and the banner does not return.
- [ ] **SEO sanity**: view source of `/` shows the new title/description; `https://inmejora.com/sitemap.xml` lists only `/`, `/servicios`, `/contacto`, 3 zones and the two legal pages; `https://inmejora.com/og-image.jpg` shows the new image.
- [ ] Console: no red errors on `/`, `/contacto`, `/servicios` (a failed service-worker log in blocked environments is not an error of the site).

## 4. Go / no-go
- [ ] A and J confirm sections 1–3 are fully ticked. Time and person: `____________________`.
- [ ] After publishing, watch the 6429 inbox for the first real consultation and confirm it arrives in the expected format (service, locality, description…).

## 5. Rollback to the previous image (X)
Trigger: any failed item in section 3, the 6429 number not receiving, or a wrong number on the site.
1. In Coolify redeploy the **previous image/digest** recorded in section 1 (do not rebuild an older commit; use the stored image). The previous version carries its old contact data, so confirm in step 3 which number it shows.
2. Confirm `https://inmejora.com/` serves the old version (footer/phone/title).
3. Tell J the previous version's contact number; if that is not acceptable, put the site in maintenance instead of leaving an unverified channel.
4. Open an issue with the failed check and its evidence; fix forward on the branch, re-run `lint`, `test:ci`, browser suite, then restart this checklist.
Rollback does not touch the Dashboard, Project Core, payments, auth or any backend: this release changes only the static web.
