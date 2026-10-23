# Project gallery across conversations

Base #31: bd915d5b2924f1cd47d757b75e29118029fc7229. Reuses the existing corrections of #29/#30 W-1/W-2; does not duplicate them. Core composition #89: 0bedaa47d55c4b41199796fb9fa7881ee044c5de.

Reproduction: Core returns the primary conversation in private-gallery.v1, while Web context comes from a second conversation of the same authorized project. The old client throws INVALID_PRIVATE_GALLERY despite a valid project response. New regression fails before this one-condition correction (6 pass, 1 fail).

Gallery authority is the project, so only project ID equality is required. Top-level and photo conversation UUIDs remain schema-validated provenance. This does not relax messaging/thread ID equality or Core authorization of project photos. Foreign project, injected URL/key, duplicate photo, bad MIME/date, expired session and unavailable service continue to reject. No provider or credit API is activated.

Local result integration: Core #90 adds optional `render_results_enabled:true` to the gallery response. Only then Web reads strict `render-gallery.v1` and `render-feedback.v1` from the same-origin authorized session. It displays persisted successful results and actual pending/uncertain/failed job states. Results use authorized private byte routes, never provider URLs. Select/adjust records feedback with CSRF, request UUID and expected revision; uncertain requests retry the same key. Neither action generates, debits, purchases or confirms a budget. Unavailable results cannot remain selectable.

The chosen UUID/hash/attempt/feedback revision flows into the existing Budget V2 snapshot in the paired local Core. Changed selection requires a new draft; economic approval remains human. Browser evidence drives actual Web and Core, synthetic PostgreSQL/auth/images/catalog, selection and adjustment, Budget V2 through its API, human takeover and restart. No model image or n8n runtime is claimed.

Validation: 102 offline tests PASS, lint 0 errors / 8 inherited warnings, offline build PASS. Independent review required. Paired contract proposal in Core release/orchestration-contract/CONTRACT.md is coordinated via issue #74; event ingress remains unmounted. Result/feedback/Budget endpoints exist only in explicit loopback composition. No production activation. C2_LIVE_PREFLIGHT=HOLD.
