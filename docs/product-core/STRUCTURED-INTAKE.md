# G-4 and controlled sales build

Base: Web #37 `5ba93a50563b831a3e7417c0f05c4ee66e5c37ac` (local equivalent `7eba6af6295b3eb9b1718f8bfdc6dd2c1c7519f6`, identical tree `fc0be21ca656908c524de37134408bdda81d525c`). Parent and Web #36 stay frozen.

Finding: Claude [6689730060](https://github.com/jona2312/inmejora_dashboard_aprobacion/issues/74#issuecomment-6689730060), coordinated in #74. The existing sales form placed measurements only in the description. The adapter always sent `project.measurements: null`.

## Structured declaration

The same form now sends `project.measurements: {declared: "3 x 4 m"}`. Empty input remains null. This preserves the customer's literal quantity; it does not calculate area, resolve ambiguity, confirm accuracy or set a requirement's authority. The Core child composition must accept this compatible alternative to the existing numeric measurement shape and append the value with `inferred`, `client_message`, `declared_only` provenance. No SQL/schema or production change is made in this Web delta.

Focused regression: the unchanged base produced two failures (null instead of declarations), with one absence check passing. After the delta those cases pass. The integrated Core test must separately prove persistence and that HOY does not report the measure as absent. A declared measure can still require human confirmation and does not force QUOTE_READY.

## Separate controlled artifact

`node scripts/ci/build-controlled-intake.mjs` builds `dist-controlled/` with Vite mode `project-core-controlled`, real optimized assets and CSS. It disables .env loading, strips inherited VITE variables, pins nonproductive API references and has no WhatsApp number. Tailwind resolves content relative to its config rather than the caller's working directory.

This profile selects Core only for a production bundle running under HTTPS. Ordinary production/CI builds keep the existing behavior. The existing local development profile is preserved. Every API call is same-origin with cookies, CSRF and redirect rejection; no admission token, reusable secret or customer authority is embedded in the bundle. The UI's selection of the transport is not admission: an unauthorized session receives DENY without another backend fallback.

The Core controlled composition must supply the reviewed one-use admission mechanism and enforce quotas, anti-replay, ownership, CSRF and private photo authorization. The old readonly/A0 profile remains unchanged and may not be made writable to run this build. No connected login, installation or public activation is authorized here.

## Verification and limits

- `node --test tests/ci/structured-intake.test.mjs`: structured/absent/ambiguous quantities, no authority escalation, exact build opt-in, HTTPS, normal build denial, failed admission without fallback.
- `node scripts/ci/build-controlled-intake.mjs && node scripts/ci/verify-controlled-build.mjs`: genuine CSS and optimized build. This is asset evidence, not visual acceptance.
- Existing offline, lint and browser gates remain in CI on the explicit head. The root composition owns the new real-build Chromium flow and screenshots, Core persistence, isolated identity and takeover-versus-automatic-output tests.
- No changes to providers, plans, ledger, pricing, promotions or productive Auth. R-1/R-2 are not commercially accepted. Gate 0 physical acceptance and the new composition's independent review remain pending. `control.enabled=false`, monitoring OFF, connected login blocked, `C2_LIVE_PREFLIGHT=HOLD`.

Local execution (Windows, installed Node 22.14.0; CI retains pinned Node 20.20.2/npm 10.8.2): 5/5 focused tests PASS; full offline command 116 PASS and 3 environment-blocked production-build tests. Those three inherited tests look for `node_modules/vite/bin/vite.js` inside the child checkout while existing dependencies resolve from its ancestor; no dependencies or tooling were installed to bypass that limitation. ESLint: 0 errors, 8 inherited warnings. Controlled optimized build and emitted-CSS checks PASS. Browser/physical acceptance are not inferred from these results. CI must run on the published final head before this delta can be accepted.
