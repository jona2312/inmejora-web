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

## Evidence files and remaining references

- [Exact remaining lint diagnostics](lint-remaining.json): 10 errors and 10 warnings.
- [Historical AST results](lint-ast-evidence.json): base/source SHAs and assertion scope.
- Reproduce the AST audit with `node scripts/ci/audit-unused-bindings.mjs` from a
  checkout containing the three referenced commits and the reconciled dependency
  graph. It reads Git source without importing application modules or accessing services.
- PR #6 CI [34478430196](https://github.com/jona2312/inmejora-web/actions/runs/34478430196):
  offline isolation/build passed; lint failed on the remaining findings.
- PR #7 source-change CI [34478948038](https://github.com/jona2312/inmejora-web/actions/runs/34478948038):
  offline isolation/build passed; lint failed on the 10 remaining errors.

The following links refer to the exact audited source revision, not a moving branch:

| Level | Resource | Rule | Diagnostic |
| --- | --- | --- | --- |
| Warning | [src/components/chat/ChatWidget.jsx:19](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/components/chat/ChatWidget.jsx#L19) | `react-hooks/exhaustive-deps` | React Hook useEffect has a missing dependency: 'initializeSession'. Either include it or remove the dependency array. |
| Error | [src/components/dashboard/CreditsWidget.jsx:7](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/components/dashboard/CreditsWidget.jsx#L7) | `no-shadow-restricted-names` | Shadowing of global property 'Infinity'. |
| Warning | [src/components/ManualQuoterPath.jsx:42](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/components/ManualQuoterPath.jsx#L42) | `react-hooks/exhaustive-deps` | React Hook useEffect has a missing dependency: 'groupedServices'. Either include it or remove the dependency array. |
| Warning | [src/components/proveedores/dashboard/ProveedorProductos.jsx:15](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/components/proveedores/dashboard/ProveedorProductos.jsx#L15) | `react-hooks/exhaustive-deps` | React Hook useEffect has a missing dependency: 'fetchProductos'. Either include it or remove the dependency array. |
| Warning | [src/components/renders/RenderWizardStep2.jsx:55](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/components/renders/RenderWizardStep2.jsx#L55) | `react-hooks/exhaustive-deps` | React Hook useEffect has a missing dependency: 'stopRecording'. Either include it or remove the dependency array. |
| Warning | [src/components/Testimonials.jsx:47](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/components/Testimonials.jsx#L47) | `react-hooks/exhaustive-deps` | React Hook useEffect has a missing dependency: 'nextTestimonial'. Either include it or remove the dependency array. |
| Error | [src/components/WhyInmejora.jsx:107](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/components/WhyInmejora.jsx#L107) | `no-constant-binary-expression` | Unexpected constant truthiness on the left-hand side of a `&&` expression. |
| Error | [src/contexts/ProveedorAuthContext.jsx:60](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/contexts/ProveedorAuthContext.jsx#L60) | `no-constant-condition` | Unexpected constant condition. |
| Warning | [src/contexts/SupplierContext.jsx:63](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/contexts/SupplierContext.jsx#L63) | `unused-eslint-disable` | Unused eslint-disable directive (no problems were reported from 'react-hooks/exhaustive-deps'). |
| Warning | [src/contexts/SupplierContext.jsx:80](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/contexts/SupplierContext.jsx#L80) | `react-hooks/exhaustive-deps` | React Hook useEffect has a missing dependency: 'toast'. Either include it or remove the dependency array. |
| Warning | [src/pages/ImageUploadPage.jsx:81](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/pages/ImageUploadPage.jsx#L81) | `react-hooks/exhaustive-deps` | React Hook useCallback has a missing dependency: 'handleFile'. Either include it or remove the dependency array. |
| Warning | [src/pages/PresupuestoPage.jsx:51](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/pages/PresupuestoPage.jsx#L51) | `react-hooks/exhaustive-deps` | React Hook useEffect has a missing dependency: 'trackView'. Either include it or remove the dependency array. |
| Warning | [src/pages/QuoterPage.jsx:51](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/pages/QuoterPage.jsx#L51) | `react-hooks/exhaustive-deps` | React Hook useEffect has a missing dependency: 'checkUserPlan'. Either include it or remove the dependency array. |
| Error | [src/utils/authValidation.js:83](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/utils/authValidation.js#L83) | `no-prototype-builtins` | Do not access Object.prototype method 'hasOwnProperty' from target object. |
| Error | [src/utils/authValidation.js:88](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/utils/authValidation.js#L88) | `no-prototype-builtins` | Do not access Object.prototype method 'hasOwnProperty' from target object. |
| Error | [src/utils/authValidation.js:93](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/utils/authValidation.js#L93) | `no-prototype-builtins` | Do not access Object.prototype method 'hasOwnProperty' from target object. |
| Error | [src/utils/authValidation.js:98](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/utils/authValidation.js#L98) | `no-prototype-builtins` | Do not access Object.prototype method 'hasOwnProperty' from target object. |
| Error | [src/utils/FormValidation.js:22](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/utils/FormValidation.js#L22) | `no-useless-escape` | Unnecessary escape character: \+. |
| Error | [src/utils/FormValidation.js:22](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/utils/FormValidation.js#L22) | `no-useless-escape` | Unnecessary escape character: \(. |
| Error | [src/utils/FormValidation.js:22](https://github.com/jona2312/inmejora-web/blob/c3734b7e986d3f9d479f4a2cdb97c7bf5dc20f74/src/utils/FormValidation.js#L22) | `no-useless-escape` | Unnecessary escape character: \). |
