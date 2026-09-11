# P0 web: lockfile reconciliation

Prepared 2026-09-10 from main `0388791316d3ea7b9a03257cd46fa36b0465dda8`.
This draft changes dependency resolution, not the dependency ranges in the manifest.
It must not be deployed automatically. A separate stacked PR supplies offline CI.

## Evidence and exact comparison

The original `npm ci --ignore-scripts --no-audit --no-fund --offline` failed with
an out-of-sync lockfile. The tracked lock described a different dependency graph:
React 19 / Router 7 / ESLint 8, while package.json requires React 18 / Router 6 /
ESLint 9 and additional UI/chart packages. The manifest is the reconciliation
authority; it was not edited by this PR.

`lockfile-comparison.json` contains every current direct requirement, its previous
and new installed version, every changed installed version and every added/removed
package location. Counts exclude the root package entry:

| Comparison | Count |
| --- | ---: |
| Old installed package locations | 684 |
| New installed package locations | 738 |
| Added locations | 255 |
| Removed locations | 201 |
| Existing locations with changed versions | 75 |

Location changes include npm hoisting/deduplication, not only additions/removals of
package names. The machine-generated lock diff is intentionally separate from CI
and application code so reviewers can assess its full dependency impact.

Notable changes include React/ReactDOM 19.2.3 -> 18.3.1, React Router/DOM 7.11.0 ->
6.30.6, ESLint 8.57.1 -> 9.39.5, and Radix/transitive dependency reconciliation.
These may affect runtime behavior even though the ranges already existed in the
manifest. Compilation is not proof of equivalent browser behavior or compatibility
of every UI component. No claim is made that dependency vulnerabilities are fixed.

## Generation and verification

Runtime: Node 20.20.2, npm 10.8.2, Windows. Lock generation used npm's local cache:

```sh
npm install --package-lock-only --ignore-scripts --no-audit --no-fund --offline
```

Clean installation passed with `npm ci --ignore-scripts --no-audit --no-fund`.
The first offline attempt lacked the cached ws tarball, so a registry-only install
populated the package cache; no dependency lifecycle scripts or audit call ran.
A second clean install with `--offline` passed from that cache (716 packages).

Compilation with the reconciled graph passed: Vite 4.5.5 transformed 3147 modules.
It used the existing Vite configuration through the programmatic build API with
`envFile: false`, `configFile: false`, mode `ci`, inherited VITE variables removed,
synthetic `.invalid` API/Supabase constants, and a preload denying fetch/HTTP/TCP/TLS.
No `.env` file was loaded, app browser runtime executed, listener opened, live client
data read, or provider request made. Output was local and was not uploaded/deployed.

The compile reported existing stale Browserslist data and a 599 kB main chunk.
The default build still references an absent generator; lint still lacks its ESLint
9 flat config; no application test suite exists. Those gates remain open in this PR.
Build isolation and its reproducible command belong to the following tooling PR.

## Rollback and release dependencies

Rollback is reverting this commit; no data or infrastructure changes are involved.
That restores the known invalid lockfile. Before any release, complete the preceding
P0 containment/rotation gates, review this dependency diff and run isolated browser
regression tests for routing and commercial flows. This PR alone is not a release
candidate and does not close P0.7.
