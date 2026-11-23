# Project gallery across conversations

Base #31: bd915d5b2924f1cd47d757b75e29118029fc7229. Reuses the existing corrections of #29/#30 W-1/W-2; does not duplicate them. Core composition #89: 0bedaa47d55c4b41199796fb9fa7881ee044c5de.

Reproduction: Core returns the primary conversation in private-gallery.v1, while Web context comes from a second conversation of the same authorized project. The old client throws INVALID_PRIVATE_GALLERY despite a valid project response. New regression fails before this one-condition correction (6 pass, 1 fail).

Gallery authority is the project, so only project ID equality is required. Top-level and photo conversation UUIDs remain schema-validated provenance. This does not relax messaging/thread ID equality or Core authorization of project photos. Foreign project, injected URL/key, duplicate photo, bad MIME/date, expired session and unavailable service continue to reject. No provider or credit API is activated.

Local result integration: Core #90 adds optional `render_results_enabled:true` to the gallery response. Only then Web reads strict `render-gallery.v1` and `render-feedback.v1` from the same-origin authorized session. It displays persisted successful results and actual pending/uncertain/failed job states. Results use authorized private byte routes, never provider URLs. Select/adjust records feedback with CSRF, request UUID and expected revision; uncertain requests retry the same key. Neither action generates, debits, purchases or confirms a budget. Unavailable results cannot remain selectable.

The chosen UUID/hash/attempt/feedback revision flows into the existing Budget V2 snapshot in the paired local Core. Changed selection requires a new draft; economic approval remains human. Browser evidence drives actual Web and Core, synthetic PostgreSQL/auth/images/catalog, selection and adjustment, Budget V2 through its API, human takeover and restart. No model image or n8n runtime is claimed.

Validation: 102 offline tests PASS, lint 0 errors / 8 inherited warnings, offline build PASS. Independent review required. Paired contract proposal in Core release/orchestration-contract/CONTRACT.md is coordinated via issue #74; event ingress remains unmounted. Result/feedback/Budget endpoints exist only in explicit loopback composition. No production activation. C2_LIVE_PREFLIGHT=HOLD.

## Delivery quota follow-up on Web #41

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
