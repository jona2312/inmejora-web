# P0-A local — consulta persistida

Base #26: `8ea656b7eeb5e59b0f813a2fe87ca4afeb72f2ab`.
Companion Core branch: `codex/commercial-mvp-p0-20261021`.

Reutiliza /contacto, formulario existente y adapter/thread canónicos. Prueba local
con PostgreSQL sintético: consulta, cuatro fotos privadas, mismo project_id y
conversation_id, takeover/respuesta del operador y recuperación tras refresh.
No utiliza localStorage como autoridad. El retry conserva idempotency key y
datos; no permite editar una operación pendiente ni enviar mientras lee fotos.

El adapter está habilitado exclusivamente en DEV, modo project-core-local,
127.0.0.1. No activa intake público en el build productivo. WhatsApp/OpenAI no
intervienen en la prueba. La alerta email genérica y HOY se preparan en Core,
no desde el navegador. Destinatario y entrega real pendientes de acreditar.

Evidencia correlacionada y limitaciones: companion
`release/commercial-mvp/README.md` y `evidence/browser.json`.
El harness renderiza ProjectWorkspace existente en wrapper sintético; falta
acreditar shell completo, composición pública, cuotas y operación real.

No autoriza deploy, APPLY ni mensajes reales. `C2_LIVE_PREFLIGHT = HOLD`.
