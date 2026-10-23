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
