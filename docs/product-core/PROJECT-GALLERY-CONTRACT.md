# Project gallery across conversations

Base #31: bd915d5b2924f1cd47d757b75e29118029fc7229. Reuses the existing corrections of #29/#30 W-1/W-2; does not duplicate them. Core composition #89: 0bedaa47d55c4b41199796fb9fa7881ee044c5de.

Reproduction: Core returns the primary conversation in private-gallery.v1, while Web context comes from a second conversation of the same authorized project. The old client throws INVALID_PRIVATE_GALLERY despite a valid project response. New regression fails before this one-condition correction (6 pass, 1 fail).

Gallery authority is the project, so only project ID equality is required. Top-level and photo conversation UUIDs remain schema-validated provenance. This does not relax messaging/thread ID equality or Core authorization of project photos. Foreign project, injected URL/key, duplicate photo, bad MIME/date, expired session and unavailable service continue to reject. No provider or credit API is activated.

Historical local result integration (#90): Core adds optional `render_results_enabled:true` to the gallery response. Only then Web reads strict `render-gallery.v1` and `render-feedback.v1` from the same-origin authorized session. It displays persisted successful results and actual pending/uncertain/failed job states. Results use authorized private byte routes, never provider URLs. Select/adjust records feedback with CSRF, request UUID and expected revision; uncertain requests retry the same key. These actions originally recorded feedback only. The current customer-acceptance debit contract below supersedes that historical behavior. Unavailable results cannot remain selectable.

The chosen UUID/hash/attempt/feedback revision flows into the existing Budget V2 snapshot in the paired local Core. Changed selection requires a new draft; economic approval remains human. Browser evidence drives actual Web and Core, synthetic PostgreSQL/auth/images/catalog, selection and adjustment, Budget V2 through its API, human takeover and restart. No model image or n8n runtime is claimed.

Validation: 102 offline tests PASS, lint 0 errors / 8 inherited warnings, offline build PASS. Independent review required. Paired contract proposal in Core release/orchestration-contract/CONTRACT.md is coordinated via issue #74; event ingress remains unmounted. Result/feedback/Budget endpoints exist only in explicit loopback composition. No production activation. C2_LIVE_PREFLIGHT=HOLD.

## Historical delivery quota follow-up on Web #41 (superseded 2026-11-27)

Base: `78536fb4a6f8c6091bfbe4153acb556b9f0c6233`. The existing private gallery reads
`allowance` from authenticated `GET /api/v1/projects/:project/render-requests`.
It validates project equality and `render-delivery-quota.v1` / `delivery-three.v1`.
Core remains the only authority for the canonical client, eligibility, reservations
and the counters `available`, `held`, `delivered`. Web does not calculate a balance.

Explicit `allowance:null` preserves the previous G10 explanation. Missing, denied,
expired or malformed allowance displays **No disponible**, never zero. The new
policy explains three sponsored deliveries per client: an authorized private
delivery counts even if the client later discards it; viewing or selecting again
does not debit again. Exhaustion displays **Recarga requerida** without checkout,
payment links or fake purchase confirmation. The new read performs no mutation.

The exact customer version tuple and adjustment request remain unchanged. Under
the new policy selection identifies preference rather than authorizing another
debit; under the previous policy it keeps its existing reconciliation meaning.
Neither UI action generates an image automatically. This Web change does not
provide a new render-request screen or an alternative authentication mechanism.

Executed locally: 148/148 offline tests, lint 0 errors / 8 inherited warnings,
`build:ci` and `build:controlled` PASS using Node 20.20.2 / npm 10.8.2. Five new
tests cover the response contract, denied/unavailable reads, repeated reads with
zero writes, and actual gallery markup for both policies. The integrated image
and physical acceptance remain separate gates; no independent approval is claimed.

## Current W41-C/D and acceptance contract (2026-11-27)

Reviewed base: `1f40936cf75dac627e0b5bd3334fa2fb27bc2fb5`; findings:
[Claude 7208934941](https://github.com/jona2312/inmejora_dashboard_aprobacion/issues/74#issuecomment-7208934941).
Jona's current rule replaces consumption on private delivery: only the authenticated
project client accepting the exact current artifact/attempt/hash consumes one
credit, atomically in Core. Operator approval, a previous acceptance and silence
do not consume it. Repeating the same acceptance adds zero debit. Web never writes
the ledger, infers ownership from contact details or calls settlement directly.

The quota DTO keeps its version and counters but requires
`consumes_on: customer_acceptance`. `delivered` is displayed as **Aceptadas**;
no historical balance or counter is reset. The old `private_delivery` DTO is
incompatible and displays **No disponible**, not an invented balance. Both the
explicit quota and `allowance:null` views describe consumption on confirmation.
An unavailable quota does not invent a consumption rule. Recarga still has no
payment or checkout action.

W41-C: a lost POST response retains its exact request key. A subsequent valid,
authorized GET of the same project reconciles that pending request only after
the revision advances and no POST is in flight. It does not retry a POST or
claim that the lost mutation succeeded; it shows the state actually returned.
Failed, malformed, stale and other-project reads preserve the pending key.
The next deliberate adjustment uses the current revision and a new key. When
the displayed authoritative state already confirms the exact tuple, Confirmar
is disabled and its handler performs zero POSTs; Pedir ajuste remains available
according to Core permissions.

W41-D: regenerate the private-gallery manifest first, then issue100, wroute and
structured-intake. Verify all four against the same working tree. Local protocol
and real-component tests are separate from integrated image/physical acceptance;
neither proves an economic transaction or independent approval.
