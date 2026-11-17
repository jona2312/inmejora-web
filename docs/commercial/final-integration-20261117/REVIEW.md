# Web final commercial boundary delta — 2026-11-17

Base: Web PR #39, `204a75ffddb23a3f61a129ee9f4f842efe5381e3`.
Branch: `codex/final-commercial-web-20261117`.
Scope: Work W1/W2/W3 in Issue #74, comment `6948561001`.
The base branch remains unchanged. This is code and offline verification, not deployment or independent approval.

## Changes

- Reject the excluded personal suffix `0611` both in build configuration and explicit arguments to the shared WhatsApp URL builder. The legacy project CTA now uses that builder and does nothing without a validated destination. No commercial number is installed or activated by this change.
- A `project-core-controlled` artifact opened without HTTPS shows a blocked state and exposes no submission form. It cannot silently turn into the ordinary WhatsApp form, even if a WhatsApp number was configured. HTTPS preserves the existing canonical form and Core authority.
- `/contacto` metadata describes the actual receipt state, without assuming WhatsApp or a completion time. `/precios` no longer promises technical plans, virtual videos, exact precision, current market prices or guaranteed outcomes. It describes human review and explicitly unavailable commercial automation/payments.
- Offline build settings now use Vite's `envDir:false`. Production-build tests also disable env loading and trap network access. No local environment file or credential is required.

The actual base homepage already used the sales components and truthful copy, and the prices page already used the canonical catalog with purchases disabled. These were preserved. Historical unmounted components were not rewritten. The production observations in Work's report are not evidence of this candidate being installed.

## Verification

Node `24.22.1`, Vite `4.5.5`, ESLint `9.39.5`; existing installed dependencies only.

| Gate | Result | Scope |
|---|---|---|
| Full `test:ci` command, executed using Node 24 | 133/133 PASS, 0 skipped | Existing offline suites plus the new boundaries and required-name regression |
| New boundary tests on pinned CI Node `20.20.2` | 11/11 PASS | Includes both base reproductions |
| Changed JS/JSX lint | PASS, exit 0 | Nine changed source/test/build JavaScript files |
| `build:controlled` | PASS | 3133 modules, `project-core-controlled`, env loading disabled, network trapped |
| `verify-controlled-build.mjs` | PASS | Actual CSS and production bundle, HTTPS mode retained |
| Production build guards | PASS | Missing/invalid/personal destination rejected; valid configured commercial number builds |
| Base reproduction | Reproduced | Personal number accepted by configuration/direct URL; controlled HTTP falls back to WhatsApp |
| Head regression | PASS | Both failures denied; HTTPS canonical form remains present |
| Git diff whitespace check | PASS | Scoped delta |
| Four dependent existing manifests | PASS | Private gallery → catalog → route containment → structured intake; regenerated hashes only |

The full test suite includes declared measurements, four-photo private gallery contracts, idempotency, expired sessions, cross-project denial, no public customer uploads, no invented credits, canonical plan/version parsing, payment containment and analytics containment. This delta did not reimplement those modules.

The new form tests render the actual JSX using React SSR and trap external/context effects. They are not Chromium visual acceptance or a live Core/CRM persistence run. No new end-to-end acceptance or independent PASS is claimed.

The offline workflow includes the new boundary suite. Its checkout depth is two because this focused commit is a direct child of the frozen Web39 SHA used by the reproduction. No GitHub Actions run was dispatched; `[skip ci]` preserves the budget gate until the integrator authorizes a concrete run.

Reproduction:

```sh
node --experimental-vm-modules --import ./scripts/ci/offline-guard.mjs --test tests/ci/final-commercial-boundaries.test.mjs tests/ci/controlled-name-required.test.mjs
npm run test:ci
node scripts/ci/build-controlled-intake.mjs
node scripts/ci/verify-controlled-build.mjs
```

Use Node 24 for the recorded results. Build warnings: stale Browserslist metadata and an existing >500 kB chunk; neither was changed to silence a warning.

## Installation dependencies and rollback

The controlled artifact still requires the exact HTTPS same-origin `/api/v1` proxy, accredited Core profile, server-issued session/CSRF and an authorized synthetic identity/admission. A build flag grants no backend permission. STOP and Core failures remain authoritative; no receipt is claimed before successful persistence. `LOCAL-FIXTURE-1` is unchanged and remains restricted to synthetic acceptance, not real-client consent.

Ordinary production mode remains a distinct, explicitly unsent WhatsApp preparation flow, without creating a lead on click. It must not be described as Web → CRM persistence. The controlled profile is not authorized for installation by these tests.

No push/remote CI, merge, installation, deployment, provider access, messages, payments or secret changes were performed. The existing Core remains the only CRM and authority. `C2_LIVE_PREFLIGHT = HOLD`.

For an approved future installation, use the reviewed Web artifact and its matching Core/proxy profile. Rollback is redeployment of the previously approved immutable artifact, never enabling a personal destination or converting a controlled build into WhatsApp mode.

## Follow-up: Claude W1 / offline publication guard

Reviewed parent: `85b875ce95e300b5bb412d0f68f4938d297bb939`, Claude comment `6950794387` in Core Issue #74. Personal-contact fixtures in the tracked tests and documents now use zero-filled synthetic data with the same excluded suffix. The historical link inventory is explicitly sanitized evidence: its replacement contact values are not a newly observed destination. The scanner checks the current tests/documents without embedding the real contact, and reproduces the parent's violation while exposing only an assertion result. It also covers formatted numbers. No public history was rewritten; historical exposure and the deployed site's version remain separate operational decisions.

The versioned production environment file was reviewed locally as expressly authorized. **No private or privileged credential requiring remediation was identified.** No values, token fragments or file hash are included here; the file was not changed. This does not accredit the production project's grants, RLS, storage policies or real connectivity, which remain outside this review and under C2 HOLD.

The PR #40 base branch is now excluded from automatic `pull_request` jobs. A normal push does not depend on `[skip ci]` to avoid execution; manual execution remains separate and was not invoked. Full checkout history retains both immutable regression baselines. No runtime, CTA, identity, credit, pricing or provider behavior changes in this privacy follow-up.

Local follow-up verification is recorded in the adjacent manifest after the final run. Previous totals above belong to the reviewed parent and are not a new result for this delta. Browser/connected-Core acceptance and Linux image acceptance remain with the integrated Core candidate; they are not claimed by source redaction or offline build tests.
