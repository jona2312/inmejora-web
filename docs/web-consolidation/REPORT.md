# Consolidación WEB — revisión Jona / Arkos

Fecha: 2026-09-11. Alcance exclusivo: `jona2312/inmejora-web`.
Base remota auditada: `main@0388791316d3ea7b9a03257cd46fa36b0465dda8`.
Punta acumulada antes de esta ejecución: `edaa757d6694997f85e718774b484fa9b8153001` (#11).
El inventario JSON adjunto conserva los SHA completos, bases, archivos y enlaces de CI del corte inicial.
No se leyó Studio ni fue necesario leer Dashboard. No se consultaron servicios de negocio,
archivos de entorno, secretos, bases ni datos de clientes. No hubo merge, deploy ni activación de pagos.

## HECHO Y VERIFICADO

- GitHub: nueve PRs abiertos al inicio, todos draft: #1 y #4–#11. No existen PRs posteriores abiertos en ese corte. #2 está merged y ya integra `main`; #3 es una issue, no un PR.
- #4–#11 forman una cadena lineal: cada base remota es ancestro de su head. Ningún padre avanzó fuera de su hijo en este corte.
- GitHub considera los nueve PRs `MERGEABLE`; eso sólo indica compatibilidad de merge, no seguridad ni aprobación.
- La API de branches informa `main.protected=false`; no se modificó esa configuración. La recomendación de mantener base verde es un gate de revisión, aunque no esté impuesto por branch protection.
- Instalación limpia `npm ci --offline --ignore-scripts --no-audit --no-fund`: PASS, 716 paquetes, Node 20.20.2 / npm 10.8.2. Cache de paquetes preexistente; no prueba instalación offline sin cache.
- Tests de #11 repetidos: 47/47. Con el cambio de esta ejecución: 50/50. Se ejecuta código real con dependencias controladas y SSR en las pruebas correspondientes; no es E2E de navegador.
- Lint de la base corregida: PASS, 0 errores y 10 warnings preexistentes. Sin nuevas supresiones ni reducción de reglas.
- `build:ci`: PASS, 3149 módulos; permanecen warnings de Browserslist y bundle >500 kB. Compilación limpia de errores, no limpia de advertencias.
- Reejecución del auditor AST histórico: #6 conserva estructura ejecutable salvo bindings de import/catch en 37 archivos. #7 conserva 138 llamadas de hooks/dependencias, 10 listeners y 39 accesos/request calls en 27 archivos. Este último control no demuestra equivalencia completa de toda la aplicación.
- Lectura real de los guards, contextos, transportes de pago, rutas de retorno, validadores, rutas comerciales, cotizador, lead y SEO. No se tomó el cuerpo de los PRs como certificación.
- Búsqueda en `src` y `public`: sin referencias `VITE_*SECRET/PRIVATE/ACCESS_TOKEN/SERVICE_ROLE`, `BEGIN ... PRIVATE KEY` ni `sk_live_`. #9 retira `VITE_MERCADO_PAGO_ACCESS_TOKEN`. Esto no audita historial completo, configuración desplegada ni valores de entorno.

## Inventario y dictamen por PR

`B` = aislamiento/tests/build; `L` = lint. Enlaces de jobs y SHA completos en [pr-inventory.json](pr-inventory.json).
Los checks de #5–#11 son del 2026-09-10; se leyeron también los logs de lint.

| PR | Base → head (rama codex/ salvo main) | B / L | Necesidad, solapamiento, riesgo y corrección |
|---|---|---|---|
| [#1](https://github.com/jona2312/inmejora-web/pull/1) | main → agent/inmejora-studio-scan-core-plan, `cbbe8956` | Sin checks | Un único documento de 626 líneas en el diff de PR. No depende de P0. Desactualizado conceptualmente: propone Studio dentro del Web/Dashboard y presupone créditos/API. Requiere reconciliar como antecedente histórico o cerrar por decisión, antes de integrarlo. Riesgo de dirección de producto, no runtime. |
| [#4](https://github.com/jona2312/inmejora-web/pull/4) | main → p0-web-reproducible-ci, `bc9a8da0` | Sin checks | Necesario. Reconcilia lock con manifest existente; cambia realmente React 19→18, Router 7→6 y ESLint 8→9 respecto del lock anterior. 255 ubicaciones añadidas, 201 retiradas y 75 cambios de versión según evidencia generada. Riesgo alto de regresión. Se solapa en lock con #5; no requiere regeneración adicional observada. |
| [#5](https://github.com/jona2312/inmejora-web/pull/5) | p0-web-reproducible-ci → p0-web-offline-ci, `e6960fbc` | PASS / FAIL 107E,10W | Necesario: gate real, config ESLint y aislamiento. Declara @eslint/js ya resuelto; toca manifest/lock. Tests/workflow serán extendidos por #8–#11. Su lint se resuelve acumulativamente, no silenciarlo. |
| [#6](https://github.com/jona2312/inmejora-web/pull/6) | p0-web-offline-ci → p0-web-lint-cleanup, `66821f56` | PASS / FAIL 58E,10W | Necesario. 49 bindings de import/catch; conserva imports por efecto lateral. Paridad AST repetida. Solapa numerosos archivos con #7 y posteriores por diseño. Riesgo bajo relativo; no deja base verde por sí solo. |
| [#7](https://github.com/jona2312/inmejora-web/pull/7) | p0-web-lint-cleanup → p0-web-unused-local-bindings, `6c2594f2` | PASS / FAIL 10E,10W | Necesario. Cierra unused locals; mantiene llamadas aunque descarta resultados y retira handlers privados sin consumidores encontrados. Cambia aridad de mocks y callbacks; riesgo medio. Validación AST parcial, requiere regresión de UI. #8/#11 cierran errores restantes. |
| [#8](https://github.com/jona2312/inmejora-web/pull/8) | p0-web-unused-local-bindings → p0-provider-auth-lockdown, `4bd63f63` | PASS / FAIL 9E,10W | Necesario. Provider legado niega todas las operaciones sin red/storage. Riesgo funcional intencional: ese acceso queda deshabilitado. NO cierra SupplierContext activo ni cliente. Sin corrección al diff necesaria; mantener explícito ese límite. |
| [#9](https://github.com/jona2312/inmejora-web/pull/9) | p0-provider-auth-lockdown → p0-web-payment-containment, `d986b382` | PASS / FAIL 9E,10W | Necesario. Tres hooks sólo notifican indisponibilidad y dos métodos MP rechazan. Retira transporte y referencia de token privado; registro libera loading para plan. Riesgo comercial intencional: no hay compra nueva por esos caminos. NO es apagado global de Edge/webhooks/suscripciones. |
| [#10](https://github.com/jona2312/inmejora-web/pull/10) | p0-web-payment-containment → p0-web-payment-status-truth, `ebb7183f` | PASS / FAIL 9E,10W | Necesario. Las tres rutas montadas de retorno muestran estado no verificado; sin interpretar query ni afirmar activación/créditos/comprobante. Solapa test list y workflow. No necesita nuevo endpoint. Modales viejos siguen sin consumidores encontrados y no deben reintroducirse. |
| [#11](https://github.com/jona2312/inmejora-web/pull/11) | p0-web-payment-status-truth → p0-web-lint-errors, `edaa757d` | PASS / PASS 0E,10W | Necesario. Retira JSX inalcanzable de WhyInmejora, alias de Infinity, regex equivalentes y hasOwnProperty seguro. 47 tests repetidos. Es base técnica verde, NO cierre de autorización: ProtectedAdminRoute aún admite user_metadata/email; se corrige en este draft. |

Ningún PR #4–#11 resulta redundante por existir #11: los diffs de GitHub son incrementales, no sustitutos independientes. El solapamiento de manifest/workflow/tests debe conservar las suites acumuladas, no elegir automáticamente una versión de un lado. El lock sólo cambia en #4 y #5.

## Orden recomendado de integración (no ejecutado)

1. Revisar el conjunto acumulado #4 → #5 → #6 → #7 → #8 → #9 → #10 → #11 → draft de esta ejecución.
2. No integrar #5–#10 individualmente como si fueran una base verde. Sus checks rojos son reales. No desactivar protección de ramas para sortearlos.
3. Para exigir `main` verde en cada integración, preferir **una integración acumulada revisada** hasta la punta corregida. Jona/Arkos deben decidir la consolidación/retarget y cómo cerrar los PRs incrementales; no se creó un segundo PR de consolidación redundante ahora.
4. Si se autoriza conservar la secuencia de merges, retargetear cada hijo después de su padre y recalcular diff/CI. Con squash/rebase cambia la ascendencia: puede ser necesario rebase cuidadoso de descendientes. No reescribir ramas durante esta auditoría.
5. La integración del código de contención no autoriza publicación. Los P0 de identidad, permisos efectivos y regresión siguen siendo gates de release.
6. #1 queda fuera de esta cadena. No importar Studio ni usar ese documento como contrato operativo vigente.

## IMPLEMENTADO EN DRAFT

Cambio de runtime pequeño: `ProtectedAdminRoute` elimina `user_metadata.role` y allowlist de email. Sólo conserva la condición exacta `app_metadata.role === 'admin'` para presentar la interfaz. Se mantienen loading, redirección de anónimo y denegación de usuario sin rol.

Tres pruebas nuevas compilan el JSX original y renderizan con React SSR: loading/anónimo, metadata falsificada/email histórico/roles malformados, y acceso con rol app explícito. El hijo privilegiado no se monta al denegar. Suite incluida tanto en npm como en CI; ninguna dependencia nueva ni cambio de lock.

Control negativo: las mismas pruebas contra el guard original de #11 detectan el defecto (2 PASS / 1 FAIL); contra la corrección pasan las tres. Se restauró el archivo corregido después de comprobarlo.

**Límite deliberado:** `SupabaseAuthContext` obtiene una sesión del navegador mediante `getSession`. El guard es presentación, no verificación criptográfica ni permiso de backend; incluso un app_metadata local falsificado puede alterar la UI. No se declara cerrada autenticación/RLS. Antes de conectar acciones privilegiadas, el servidor debe verificar identidad vigente, rol y ownership; falta esa evidencia. Las páginas admin inspeccionadas usan mocks, no se las presenta como administración funcional.

Impacto: quien dependía del email o de user_metadata deja de ver el admin. No se asignaron roles ni se modificó usuario alguno. Revertir para restaurar esas excepciones no es un rollback seguro; ante incidencia, mantener denegación y corregir el contrato en otra revisión.

Preparación comercial en draft: [arquitectura, rutas, funnel y aceptación](COMMERCIAL-ARCHITECTURE.md) y [ejemplo de lead](lead-v1.example.json). Son especificación, no endpoints ni UI desplegados.

## PENDIENTE — P0 WEB abierto

| Bloqueo | Evidencia en Web | Criterio de cierre |
|---|---|---|
| Identidad cliente desde navegador | `InmejoraAuthContext`: restaura `inmejora_user` + cualquier token; login guarda user.id como token; `ProtectedRoute` usa `!!user` | Contrato de sesión real, nunca ID como bearer; prueba de identidad/expiración/ownership en entorno aislado y 401/403 del servidor. |
| Proveedor activo conserva estado inválido | `SupplierContext`: inicializa identidad desde storage; GET exitoso sin provider no la limpia; `supplierApi` usa supplier_token | Estado inicial denegado, respuesta válida tipada, errores/200 inválido/revocación niegan; controlar carreras de sesión y probar efectos en navegador. Requiere contrato de supplier-login, no sustituirlo por el provider legado. |
| Permisos efectivos de recursos | `rendersAPI.list` toma user.id local; delete usa id; guard admin sólo UI | Servidor/RLS/storage impiden lectura/escritura entre usuarios y administración no autorizada. No inferir exploit efectivo sin ver políticas. |
| Pagos fuera del frontend | Fuente Edge checkout ausente del árbol auditado; #9 no cancela enlaces ni suscripciones; helper webhook reside en src sin consumidor encontrado | Evidencia autorizada de contención en servidor y revisión de firma/idempotencia/ownership antes de reactivar; rotación si el token privado fue distribuido. Ninguna acción productiva en esta tranche. |
| Dependencias y regresión | React/Router cambian majors del lock; warnings de efectos; bundle principal ~597 kB | Navegador aislado móvil/escritorio: navegación, formularios, menús/modales, errores/denegación y pagos sin requests. Evaluar dependencias con revisión específica; no actualizar indiscriminadamente. |
| Verdad de capacidades | Renders y recuperación de contraseña tienen mocks exitosos; pricing/cotizador contienen promesas no verificadas | No mostrar éxito ni resultado formal sin backend confirmado; matriz por ruta de disponible/manual/no disponible. |
| Captura pública y fotos | `presupuestoApi`: rate limit local fail-open, consulta duplicados por teléfono/descripcion y `getPublicUrl` de fotos | Antiabuso/privacidad en servidor, uploads privados y reglas verificadas; no asumir que el bucket es público o privado sin evidencia. |

## REQUIERE DECISIÓN

- Jona/Arkos: integración acumulada o manejo explícito de cadena; destino histórico de #1. No se solicita permiso para merge en esta ejecución.
- Oferta: alcance de Construir (hoy se encuentra albañilería/Durlock, no evidencia suficiente de obra nueva integral); Impermeabilizar (hay reparación de humedades, falta validar alcance técnico). Captar consulta no equivale a prometer ejecución.
- Catálogo comercial aprobado, zonas realmente atendidas, responsable/tiempo de respuesta y casos con autorización. La web afirma Zona Sur/AMBA, 72h y 24h; el código no acredita capacidad operativa.
- Dominio canónico: el código utiliza inmejora.com y también enlaces de ecosistema .com.ar. No cambiar dominio/redirects de infraestructura sin decisión.
- Responsable del contrato de leads y de identidad. Sin contrato seguro, sólo prototipo local y atención manual honesta.

## BLOQUEADO para certificar release

No existe evidencia en esta ejecución de políticas RLS/storage desplegadas, Edge checkout/supplier-login vigente, propiedad de tokens ni apagado externo de cobros. Se respetó la exclusión de infraestructura, secretos y producción. Esto limita la certificación; no impidió auditar, corregir el guard y preparar la arquitectura.

No se corrieron navegador/E2E, Core Web Vitals reales, accesibilidad completa ni pruebas con servicios reales. CI de Ubuntu aporta aislamiento OS; local Windows sólo el guard de Node, que no es aislamiento universal de procesos. La instalación CI accede al registry: **offline son los checks**, no toda la pipeline.

## Siguiente tranche exacta — sólo propuesta

Issues creadas en Web, sin duplicar la issue #3 de Studio:

- [#12 — Identidad y permisos](https://github.com/jona2312/inmejora-web/issues/12): P0 y siguiente tranche.
- [#13 — Evidencias de release y pagos](https://github.com/jona2312/inmejora-web/issues/13): P0, regresión y dependencia externa.
- [#14 — Oferta y casos verificables](https://github.com/jona2312/inmejora-web/issues/14): COM-1/2, HOME-1, QUOTE-1.
- [#15 — Lead y funnel](https://github.com/jona2312/inmejora-web/issues/15): LEAD-1/2, continuidad y portal futuro.
- [#16 — SEO y performance](https://github.com/jona2312/inmejora-web/issues/16): SEO-1..5 y PERF-1/2.

Las issues definen aceptación y dependencias; su creación no inició la siguiente tranche ni autoriza operaciones externas.

**P0 WEB identidad y regresión, antes del funnel productivo.** Inventariar contrato verificable de sesión cliente/proveedor; contener los falsos éxitos de auth; corregir fail-open de proveedor con pruebas de carreras/expiración/200 inválido; verificar guards y requests en navegador con fixtures y sin salida a proveedores; evidenciar ownership de APIs en entorno autorizado. Mantener pagos deshabilitados. Entrega: un draft acotado, tests reproducibles y matriz de gates. Si no hay contrato disponible, denegar explícitamente las capacidades afectadas y dejar dependencia documentada; no inventar API ni reutilizar ID local como credencial.

Después de esa tranche, y con revisión de oferta, implementar Home + funnel comercial según el documento asociado. No se inició esa implementación ni integración Studio en esta ejecución.

Referencia de autorización: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), consultada el 2026-09-11; metadata de usuario no debe decidir permisos. Changelog consultado; este diff no migra SDK ni APIs.
