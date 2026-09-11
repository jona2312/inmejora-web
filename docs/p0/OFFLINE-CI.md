# P0 web: offline verification tooling

Historical scope of the original offline tooling PR. Issue #13 subsequently adds
an isolated Chromium/loopback job and synthetic report artifacts; see
[current browser evidence](WEB-BROWSER-EVIDENCE.md). The original unit, lint and
build gates below remain in place.

Stacked on the lockfile reconciliation PR (#4), base commit
`bc9a8da01f873eb8382e210898dc1c186e607c74`. This PR does not change application
source or authorize deployment. The commercial frontend remains in this repository.

## What the workflow proves

The workflow pins Node 20.20.2 and verifies npm 10.8.2, uses `npm ci` with lifecycle
scripts/audit disabled, then runs checks inside Linux network namespaces with no
network interface configured. Registry downloads are needed for the install unless
the cache is populated. **The install is not offline; verification after it is.**
There are no service credentials, service containers, browser sessions, deployment
steps or artifact uploads. Both jobs have read-only repository permissions.

The build is the real Vite compilation using the existing config/plugins/aliases.
The CI wrapper disables env-file loading, removes inherited `VITE_*` variables,
and substitutes synthetic `.invalid` API/Supabase values. It does not load the
tracked `.env.production`. The client application is compiled, not executed.
Existing hardcoded URLs elsewhere in the application are not removed by this PR;
the generated bundle must not be mistaken for a safe runtime integration or deployed.

A JavaScript network guard provides immediate failures for common fetch/HTTP/TCP/
TLS/DNS/UDP APIs during local checks. This is defense in depth, not an OS sandbox;
CI additionally disables networking for the whole check process tree via `unshare`.
Windows local verification has the JavaScript guard but not a Linux namespace.

## Commands and actual coverage

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run test:ci
npm run build:ci
npm run lint
```

`test:ci` contains 10 containment/tooling tests, not application business tests:
nine deny-network checks plus env-file/API-constant build isolation. Compilation
checks the reachable application imports. No claim is made about browser routing,
accessibility, authentication, form submission, payment or photo workflows.

The default build removes `node tools/generate-llms.js || true`: that file did not
exist in main, so every build hid its failure. `vite build` preserves the actual
compilation path and now propagates errors normally. Only `build:ci` uses synthetic
configuration; do not run the default build with production environment files as a
substitute for the isolated check.

## Gates remain explicit

ESLint 9 now has a flat config with JavaScript recommended rules, JSX symbol usage
and React Hooks rules. The old `--quiet` flag is removed. No baseline suppressions,
`continue-on-error` or rule reductions make the current lint failures pass.

Local evidence (2026-09-10):

- Isolation tests: 10/10 passed.
- Guarded build: passed, 3147 modules; existing stale Browserslist and 599 kB chunk
  warnings remain.
- Lint: **FAIL, 107 errors and 10 warnings** across 243 scanned files. All findings
  are in existing `src/` files; added tooling files are clean. Breakdown: 97 unused
  variables, one shadowed restricted name, one constant binary expression, one
  constant condition, four prototype-builtins calls and three unnecessary escapes.
  Warnings: nine exhaustive-deps and one unused suppression directive.
- Full application business/browser test coverage: missing, not inferred from the
  tooling tests. P0.7 and production gates remain open.

The independent lint job intentionally fails until a separately reviewed cleanup
fixes the source findings. It does not prevent the build/isolation job from reporting
its own result. Review/merge the lockfile PR first, then retarget this PR to main.
Rollback is a Git revert; no data or infrastructure was changed.

References consulted: [Vite 4 configuration](https://v4.vitejs.dev/config/shared-options.html)
and [ESLint flat configuration](https://eslint.org/docs/latest/use/configure/configuration-files).
`envFile: false` was also verified in the installed Vite 4.5.5 InlineConfig types.
