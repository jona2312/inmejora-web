# P0 web lint: unused imports and catch bindings

Base: offline CI PR #5, commit `e6960fbc919cde1fdc1316f616cab9184cabdf08`.
This tranche removes 49 unused bindings from 37 source files. It does not change
ESLint rules, hook dependencies, route definitions, function bodies or UI behavior.

Import declarations retain their module specifier and original order. If all named
bindings were unused, a side-effect-only import remains so module initialization
is not removed without a separate dependency review. Components/modules themselves
remain in the repository. Catch clauses use optional binding syntax only when
ESLint confirms the caught identifier has no references; catch bodies are unchanged.

Validation (2026-09-10):

- AST comparison against the base passed for all 37 changed files after normalizing
  only import specifiers and catch parameters. Every other executable AST node,
  including import sources, function bodies and hook calls, was identical.
- 10/10 existing CI-isolation tests passed; these are not application business tests.
- Offline Vite build passed, 3147 modules; existing Browserslist/chunk warnings remain.
- Lint errors decreased **107 -> 58**, including `no-unused-vars` **97 -> 48**.
  All ten existing warnings and the other ten errors remain visible and failing.
- No network-enabled browser test or production service was used. No deployment,
  secret, credential rotation, data or infrastructure change is part of this PR.

The React review checklist confirmed unchanged hook order, effects, event listeners,
render trees and imports' module initialization. Browser/commercial workflow tests
are still missing, and P0.7 is not closed. The remaining unused local declarations,
callback parameters and other rule findings require separately reviewed tranches.
Rollback is a Git revert of this PR, with no data or infrastructure operation.
