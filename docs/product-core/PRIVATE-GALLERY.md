# Galería privada Web — revisión aislada

Base #27: `296fdef9f3ff3acb5ba81ea28113417a4de48980`. Dependencia Core: hijo aislado de ledger #87 `240f4946d5fde3f58dc3ae9fb2d3a1c750a14e21`. No incorpora ramas hermanas ni despliega.

`/contacto` reutiliza el intake y muestra las cuatro fotografías originales después de persistirlas. `RenderGallerySection` deja de leer transacciones de `client_credits` como si fueran renders; usa `private-gallery.v1` de Core y la misma capability HttpOnly. La respuesta se valida con IDs, MIME, fecha, campos exactos y ausencia de duplicados. No se admiten URLs del servidor como destino de imagen: las rutas se construyen localmente con UUID y Core revalida cada lectura. El detalle de almacenamiento nunca llega al navegador.

Una falla de lectura, un contexto diferente, expiración o una imagen denegada muestran no disponible, sin fotos antiguas ni falso vacío. La galería sólo está habilitada por el gate local preexistente; no abre producción.

Se retiran los éxitos ficticios de `rendersAPI` y el wizard. Todas las operaciones legacy deniegan con `BLOCKED_SOURCE_EXPORT`, sin leer localStorage ni tablas financieras. El contexto de suscripción ya no asigna 3 créditos ni descuenta en memoria. Saldo desconocido = null/no disponible, no cero válido. El widget y display de créditos lo explican. No se sustituye el ledger #87 ni se monta una autoridad económica en React.

**Integración funcional n8n = BLOCKED_SOURCE_EXPORT**. No se recibió fuente funcional revisada; #84 no es importable. Esta entrega muestra originales, no resultados generados. Quedan por implementar/verificar resultados/variantes, máscara/protección determinista, feedback, selección para Budget y retención. No se declara completo el Renderista.

Pruebas: suite offline Node (93 casos incluidos los cinco nuevos del contrato y el estado financiero desconocido); lint 0 errores/8 warnings heredados; build offline; regresión Chromium existente. E2E entre repositorios: runner `tests/project-core/private-gallery-browser.ts` del candidato Core contra este checkout. Cuatro fotos privadas → Dashboard real → mismos IDs → alerta sintética única → toma humana → respuesta → refresh/restart; fallo de fuente visible. MySQL/trpc de autenticación UI es fixture, no acreditación productiva. PostgreSQL/Core y almacenamiento son reales y descartables, exclusivamente locales.

No hay nuevas dependencias, migraciones, API keys, env productivo ni permisos de producción. No llamadas pagas, envíos, WhatsApp ni n8n ejecutado. C2_LIVE_PREFLIGHT = HOLD.

Resultado final local de Chromium existente: **315 PASS, 55 SKIPPED heredados**, cero fallos. Los omitidos no se declaran acreditados. Evidencia resumida en `private-gallery-verification.json`; el E2E de galería está en el paquete Core, con capturas de Web móvil, CRM, persistencia y error.

Rollback: detener composición de pruebas; conservar padres intactos. No volver a activar mocks como mecanismo de recuperación. La integración común #85/#86 se mantiene separada hasta PASS independiente.


## G10 — confirmación del cliente (2026-11-23)

Delta hijo de Web #40 `cef7f965502ce7d6ee4a51b9102cddb96dab416c`; el padre permanece intacto. La galería reconoce la versión exacta entregada por Core (`attempt_id`, `artifact_sha256`) y sus permisos separados `can_select` / `can_adjust`. Sólo una sesión reconocida por Core como cliente del proyecto muestra «Confirmar esta versión». La capability de intake permite únicamente las operaciones que Core autoriza; nunca se convierte en una confirmación del titular a partir de email o teléfono.

Seleccionar transmite artefacto, intento, hash, revisión esperada y una key conservada en un retry. Un cambio de versión/revisión mientras la respuesta es incierta se rechaza; no se sustituye silenciosamente el pedido anterior. La selección histórica sin `confirmed_by_customer` se presenta como historia, sin otorgarle consentimiento. El consumo sigue en Core y exige la confirmación vigente: esta Web no liquida créditos ni llama al proveedor.

El contrato estricto acepta además `explanation` y `in_review`, que el Core integrado ya emite. Conserva las rutas privadas construidas con UUID y rechaza URLs arbitrarias/campos desconocidos. No introduce un login alternativo ni habilita producción. Las pruebas focalizadas reproducen el rechazo del payload actual en el padre y su aceptación en el hijo; la prueba de imagen/Chromium pertenece al candidato integrado Core que fije este SHA.

GitHub Actions no se dispara automáticamente en el PR hijo sobre `codex/final-commercial-web-20261117`; permanece disponible sólo la ejecución manual autorizada cuando se acredite presupuesto. Sin APPLY, proveedores, envíos o cambios productivos. `C2_LIVE_PREFLIGHT = HOLD`.
