# Commercial assistant P0 — Web candidate

Base PR #25: e2f6b25628b334aa81de9e9dc195f4873036a0c7.
Branch: codex/commercial-assistant-web-20261014. No production changes.

Change: 24–72 **elapsed** hours for initial human review, starting only when the responsible human confirms sufficient information. No automatic quote, confirmed visit or automatic price. The contact form still prepares a WhatsApp message; a click never records a confirmed lead. Source/campaign text is declared origin, not attribution or identity proof.

Validation on this candidate: 87/87 CI tests; lint 0 errors / 8 inherited warnings; production build with a synthetic number; sales browser suite 145/145 on 360, 390, 412, 768 and 1440 px. Default production build without VITE_COMMERCIAL_WHATSAPP correctly refuses to build. Synthetic build number 5491100000000 is NOT a deployment destination.

Core acceptance imports the actual buildConsultaMessage formatter and demonstrates admission only after an authenticated provider event. Companion Dashboard branch: codex/commercial-assistant-final-20261014, based on #67. See its release/assistant-final package for IDs, photos, authority, handoff, alert and rollback evidence.

Publication BLOCKED until Jona confirms operational capacity for 24–72 elapsed hours and the concrete release/channel. Real-model acceptance is pending. No deployment, merge or real messages authorized by these tests.

Rollback: restore the prior Web artifact; never change the canonical WhatsApp destination without approval. Keep form semantics (prepared is not received) intact.
