# Legacy provider auth containment — not active supplier authentication

## Scope and evidence

Static audit dated 2026-09-10. Web baseline: `6c2594f20c60f7926bfbced0af491c54dce542f8`
(PR #7). Dashboard source inspected: `4ed3ff3f7f301fc2538acd162b23e5367dd784e7`.
Neither SHA is asserted to be deployed. No production API, database, data, secret,
or infrastructure was accessed. No deployment, merge or rotation is included.

This PR deliberately disables **only `ProveedorAuthContext`**, a legacy mock.
It does **not** secure `SupplierContext`, `/supplier-login`, `/supplier-products`,
the current supplier portal or its server-side authorization. P0 remains open.

## Findings and consumers (references at the baseline SHAs)

| Finding / severity | Evidence and affected resource | Risk / dependency | Proposed resolution and acceptance |
| --- | --- | --- | --- |
| Legacy fail-open / high | `src/contexts/ProveedorAuthContext.jsx:23–60`: browser JSON, fetch error converted to success, unconditional `if (true)`; `:95–123`: mock login and registration | Forged provider identity and false success; no verified `/api/provider/validate` server contract | This PR: constant denied context, no request or storage access; arbitrary credentials, forged storage and absent context must never produce identity/success |
| Active session trust / high | `src/contexts/SupplierContext.jsx:23–63`, `src/utils/supplierApi.js:17–18`: initial identity/login from browser; HTTP 200 without `provider` leaves previous state; `SupplierProtectedRoute.jsx:7–29` gates only loading/login | Browser UI authority is not server authorization; stale/invalid identity may unlock UI after malformed success. Actual data access depends on backend validation, not proven here | Future server contract + frontend state-machine PR; no identity until authoritative validation; malformed, expired, revoked, missing and unauthorized responses deny |
| Active logout has no server revocation / high | `SupplierContext.jsx:127–133`, `supplierApi.js:12–15` only clear browser state | Stolen bearer may remain usable; server lifetime/revocation unknown | Define revoke/logout contract and expiry; acceptance: previously issued token rejected by sensitive endpoints after revocation |
| Routed registration falsely succeeds / medium | `App.jsx:161` mounts `ProveedorRegisterPage`; `ProveedorRegisterPage.jsx:76–87` only delays, displays success and redirects | No supplier created despite success message | Separate product/backend decision; do not connect a different identity store silently. Acceptance: real pending account or explicit unavailable state, never simulated success |
| Dashboard is not a drop-in auth backend / high | `server/services/supplierPortal.ts:37–67,394–452`: JWT fallback literal, middleware checks token type but not current supplier status; `/api/proveedores/login` returns `{token,supplier}` with MySQL supplier ID | Different URL, response envelope, identifier/storage model; fallback signing key known from source; suspended supplier may retain previously issued token access | Remove fallback, require configured key, validate claims and current status on every protected request, define mapping/migration before switching. Signing key: **ROTATION REQUIRED if fallback or another exposed key was used**; determine affected tokens and invalidate them. No live key/use was inspected or rotation performed |

`authValidation.js` is form UX validation, not authentication or authorization.
Login, registration, forgot-password and profile pages import its individual
validators; the `validateForm` helper has four unsafe `formData.hasOwnProperty`
calls. It is unchanged here and its lint errors remain visible.

## Exact active flow and backend dependency

1. `App.jsx:245–246` mounts **both** providers. `/proveedores/login` routes to
   `SupplierLoginPage`, which calls `SupplierContext.login`.
2. `SupplierContext.jsx:87–104` POSTs `/supplier-login` with action `login`, email
   and password through `supplierApiCall`. It expects `{token,provider}` and
   persists `supplier_token` and `supplier_data` in localStorage.
3. At mount/token change `SupplierContext.jsx:39–85` GETs `/supplier-login` with
   bearer token and expects `{provider}`. The helper targets Supabase Edge
   Functions; these implementations were not found in the inspected versioned
   web/dashboard source. Their deployed implementation was not queried.
4. `/proveedores/portal` uses `SupplierProtectedRoute` and `SupplierPortalPage`.
   The page GETs `/supplier-products`; POST/PUT use the product object; DELETE
   sends its ID. Ownership must be derived server-side from verified supplier
   identity and rechecked for **each** read/write/upload, not from browser IDs.
5. `SupplierContext.logout` only clears browser keys and navigates. Registration
   method POSTs action `register`, but the routed registration page does not call
   it. `SupplierRegistrationPage` is lazy-initialized but has no route in App.

Required server work before touching that commercial flow:

- Inventory and version the **actual** `/supplier-login` and `/supplier-products`
  deployment, data store, identity identifiers, session format, expiry and
  consumers. Capture deployment provenance without retrieving/logging secrets.
- Choose and document the canonical identity mapping explicitly. Dashboard's
  `/api/proveedores/login` returns `supplier`, not `provider`; its profile GET
  returns a bare row. Do not merely rename keys or URLs and assume equivalence.
- Provide an authenticated existing-session validation contract that returns a
  stable supplier identifier and current approved/active status. Exact schema,
  error codes and transport must be reviewed with backend ownership; no invented
  endpoint/RPC/metadata fallback is introduced by this PR.
- Validate signature/session, expiry, revocation, current supplier status and
  resource ownership server-side. Reject anonymous, forged, expired, revoked,
  pending, rejected and suspended sessions. CORS is not authorization.
- Specify logout/revoke semantics, all-session revocation for compromise,
  concurrent requests and suspension. Test cross-supplier product IDs and uploads
  without accessing real data. Never use user-editable metadata as authority.
- Then make frontend state deny by default, treat cached profile as display-only,
  validate successful response shape, suppress stale validation results after
  logout/token replacement and fail closed on timeout/network/HTTP errors. Test
  these transitions against local controlled fixtures, not production.

## Legacy consumer/dependency review before replacing behavior

No component, route, table, function in infrastructure or data is deleted.
The compatibility export names and import path remain unchanged.

- `App.jsx` globally mounts `ProveedorAuthProvider`; it now does no mount-time
  network request, timer or browser storage operation.
- `Header.jsx:24` asks this context for `token` and `proveedor`, fields the old
  context did not expose. Both remain absent; this PR does not change menus or
  invent aliases that would enable a new authenticated UI.
- `ProtectedProveedorRoute` consumes `provider/loading/checkSession`. It is not
  imported/routed by App. If used later, it sees a settled null provider and
  redirects to login; retry cannot grant access.
- `ProveedorLoginPage`, `ProveedorDashboard`, `ProveedorProductsPage` and
  `ProveedorProductFormPage` use the legacy context but are not routed by App.
  The legacy dashboard subcomponents also retain their files. Mock login,
  mock registration and localStorage identity restoration are intentionally no
  longer available; this is a behavior change, not a lint-only cleanup.
- `login`, `register`, `checkSession` and `logout` all return an immutable
  `{success:false,code:'LEGACY_PROVIDER_AUTH_DISABLED',error:...}`. Logout does
  not claim a server revocation occurred. No legacy storage keys are deleted;
  they are ignored and cannot establish identity in this context.
- `SupplierContext`, supplier API helper, commercial routes, Budget V2 and all
  backend files remain byte-for-byte unchanged from PR #7.

## Verification and limits

`npm run test:ci` includes the 10 existing isolation checks and four new tests:
compatibility export points at tested code, real React server rendering inside
and outside provider, immutable denial for every operation with hostile inputs
and storage traps, and forged approved browser data remaining unauthorized and
unmodified. Network guard is preloaded; CI also disables networking at OS level.
No actual app tree, API, Supabase client or production credentials are loaded.
SSR is not a browser end-to-end test of commercial supplier login/products.

`npm run build:ci` compiles using synthetic config and without dotenv loading.
`npm run lint` must remain honest: only the legacy constant-condition error is
expected to disappear. No lint rules are weakened or warnings hidden.

Local results: offline frozen `npm ci --offline --ignore-scripts --no-audit
--no-fund` installed 716 packages; tests passed **14/14**; guarded build passed
with 3148 modules. Targeted lint of the changed context and test files passed.
Full lint remains **9 errors + 10 warnings** (baseline 10 + 10); exact previous
diagnostics are in `lint-remaining.json`, minus the resolved legacy context
constant-condition entry. Stale Browserslist data and a 597.20 kB main chunk are
still build warnings. The package lockfile and dependency versions are unchanged.

Manual rollout is **not authorized** by this PR. Review stacked dependencies and
approve a separate deployment only after production containment/security order
is satisfied. Rollback must not restore mock auth/fail-open code: retain this
denied implementation or an independently approved secure replacement. Old
browser keys survive intentionally; do not re-enable their authority on rollback.
