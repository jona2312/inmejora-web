# P0 web lint: local binding dependency review

Base: PR #6, commit `66821f560e42e0d92b4f0081066425be33a50479`.
Review recorded before removing declarations (2026-09-10).

## Dependencies and allowed cleanup

- `BeforeAfterSlider.handleMouseUp` and `BeforeAfterCard.handleMouseUp` in
  `TransformacionesReales.jsx`: private closure declarations with zero references.
  Both components use a different `handleGlobalMouseUp` inside their existing
  effect; mouseup/touchend registrations and cleanup remain untouched.
- `ProveedoresHero.handleNotImplemented`: private closure with zero references.
  Both visible buttons already call `navigate` directly. The dead handler can be
  removed; retain `useToast()` invocation so hook ordering/subscriptions are unchanged.
- Unused `SupplierRegistrationPage` lazy result: no route/JSX reference. Retain the
  initializer call and the component file; no route is added or removed.
- Unused hook-result fields/state values: remove only the unused binding, retain
  every hook call in the same order and keep all setters and existing effects.
- Unused `response` result: retain the exact awaited fetch and catch fallback.
  The existing fail-open provider validation is a separate security finding, not
  repaired or enabled by this lint PR.
- Unused quote calculation results: retain function calls/conditional evaluation,
  so this cleanup does not alter pricing behavior or implicit error handling.
- Unused form/mock callback arguments: JavaScript callers may still pass them;
  bodies and call sites remain unchanged. These frontend callbacks/stubs do not
  inspect `arguments`; no function-arity reflection was found in their consumers.
  Removing formal arguments changes `.length` metadata, not their current results.
  Mock auth/payment/render paths are not made operational by this cleanup.

No component files, exported functions, tables, data or infrastructure are removed.
No ESLint rules, warnings or hook dependency arrays are changed. Other lint rules
remain out of scope because some require decisions about real behavior.

## Verification

- Lint: **58 -> 10 errors**, `no-unused-vars` **48 -> 0**. Across PRs #6 and this
  tranche, the original 97 unused-variable findings are eliminated. All 10 warnings
  and the other 10 errors remain visible; no rule or warning is suppressed.
- AST comparison across 27 changed source files verified the same sequence of 138
  hook calls and their dependency arrays, plus identical 10 event listener calls
  and 39 request/data-access call expressions. This is static evidence, not proof
  of complete runtime equivalence. Only the three private, unreferenced handlers
  listed above are removed; their consumers were documented before the edits.
- The 10 existing isolation tests and offline compilation passed (3147 modules).
  No browser runtime or network-enabled service test was executed. Commercial
  regression coverage remains missing, and P0.7 is not closed.

Remaining errors require a separate tranche: `Infinity` icon naming, a constant
JSX expression, fail-open provider validation (`if (true)`), unsafe property checks,
and regex escapes. In particular, provider authentication must be designed and
tested as a security fix rather than made green by changing a lint rule.

Rollback is a Git revert. No deployment, credentials, data or infrastructure change
was executed; no production environment file was loaded by verification.
