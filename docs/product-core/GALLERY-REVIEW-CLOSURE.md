# Web gallery review closure — isolated candidate

Base Web #29: `c14240181e7a845d199e19f05c65b00c6957597a`. Core #88: `6900d9cebfcee8d2d9997853297e06ad226323d2` (independent local PASS only).

W-1: Portal, ClientDashboard and plan management consume the existing unavailable subscription state. No direct legacy credit/subscription queries; no zero/5/3 credit defaults, fabricated counts, premium status or simulated cancellation. Legacy dashboard stats explicitly reject unavailable data; render detail no longer interprets a journal entry as an image. An additional PlanManagement mock was found by the new whole-source regression and contained as part of W-1.

W-2: useImageUpload delegates to the existing disabled rendersAPI; returns false and an explicit error, never a fake job, image URL or balance. No browser identity/storage reads, external effects or timers. Its ImageUploadPage caller no longer attempts browser credit deductions or a speculative success toast.

Multi-conversation: gallery remains project-scoped. Top-level project and intake conversation still match the authorized context. Photo conversation UUIDs are provenance; they may differ from the intake conversation. Core already joins every attachment to its project and conversation, checks capability/membership, and refuses cross-project byte access. The client still rejects foreign project/top-level context, URLs/internal keys, duplicate IDs and malformed metadata. This does not change thread authority or solve the pre-existing backdated-conversation intake issue.

Verification: 99 offline tests PASS; lint 0 errors / 8 inherited warnings. Includes SSR of actual Portal/ClientDashboard/PlanManagement, real upload hook and legacy API tests with hostile storage/network, whole-source legacy-credit scan and multi-conversation validation. Offline build PASS. Chromium 315 PASS / 55 inherited SKIPPED, five viewport widths. Integrated Core PostgreSQL + actual Dashboard/Web browser flow PASS, including same-project photo provenance across two conversations; no external providers. Evidence: review-verification.json and Core integration release/p0-integrated-lab/evidence/browser/.

No production enablement: render provider unavailable, credit HTTP service/checkout disabled, subscriptions unknown, actual n8n source blocked. No secret/export transfer attempted. Core authorization remains authoritative. C2_LIVE_PREFLIGHT=HOLD.

Rollback: return to the previous Web artifact only with render/credit features still disabled; parent contains known W-1/W-2 defects. No database migration or dependency change. Both PR parents preserved.
