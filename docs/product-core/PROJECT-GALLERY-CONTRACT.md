# Project gallery across conversations

Base #31: bd915d5b2924f1cd47d757b75e29118029fc7229. Reuses the existing corrections of #29/#30 W-1/W-2; does not duplicate them. Core composition #89: 0bedaa47d55c4b41199796fb9fa7881ee044c5de.

Reproduction: Core returns the primary conversation in private-gallery.v1, while Web context comes from a second conversation of the same authorized project. The old client throws INVALID_PRIVATE_GALLERY despite a valid project response. New regression fails before this one-condition correction (6 pass, 1 fail).

Gallery authority is the project, so only project ID equality is required. Top-level and photo conversation UUIDs remain schema-validated provenance. This does not relax messaging/thread ID equality or Core authorization of project photos. Foreign project, injected URL/key, duplicate photo, bad MIME/date, expired session and unavailable service continue to reject. No provider or credit API is activated.

Validation: 100 offline tests PASS, lint 0 errors / 8 inherited warnings, offline build PASS. Independent review required. Paired contract proposal in Core release/orchestration-contract/CONTRACT.md is unmounted; this Web PR does not claim a final render gallery, n8n integration or Budget V2 selection UI. C2_LIVE_PREFLIGHT=HOLD.
