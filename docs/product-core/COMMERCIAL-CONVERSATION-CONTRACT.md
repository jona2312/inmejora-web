# Commercial conversation mode compatibility

Parent: Web #22, exact `7d6705e395cdc94d9e36d935bbd5e14c5e5754e8`.

The Project/Commercial convergence needs three distinct backend modes: `paused`
(no automated generation), `human` (operator control), and `auto` (explicitly
enabled by an assigned operator). The #22 public response parser accepts only
the first two and rejects an otherwise valid public timeline in `auto` mode.

This child adds only `auto` to that response enum. It does not grant authority,
enable automation, change ownership, add storage, change intake/message requests,
or relax public visibility and actor-identifier validation. Unknown modes still
fail closed. The original #22 checkout and PR remain unchanged.

Local validation:

- Project adapter: 7/7 PASS, including `auto` acceptance and unknown-mode rejection.
- Existing offline suites: 70/70 PASS.
- Lint: zero errors, eight inherited warnings.
- Offline build: PASS.
- Browser regression: initial 158 PASS / 1 failed / 1 intentional skip. The single
  failure was a local dynamic asset fetch on the existing checkout-success route;
  the targeted unchanged rerun passed 1/1. No payment code was changed.
- Exact Web #22 + exact Core #48 inherited E2E: 27/27 PASS, rerun separately.
- This child + converged Core + PostgreSQL + actual n8n 1.119.2 + deterministic
  provider + Chromium: correlated Web/CRM/commercial timeline and human handoff
  verified by Dashboard's `tests/project-core/commercial-n8n.ts`.

No production wiring, merge, deploy, real provider request or workflow activation.
The companion Dashboard evidence records exact IDs, context bounds and screenshots.
