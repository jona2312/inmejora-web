# P0 Web — consolidación acumulada auditada

**Candidato técnico de consolidación; NO es release ni autorización de deploy.** Rama nueva `codex/web-consolidated-audited-baseline`, creada desde `origin/main` **0388791316d3ea7b9a03257cd46fa36b0465dda8**. Fuente efectiva: PR #19, **1ea6494cac1c1b5769fe861fbb530fe6a348384f**.

## Método y equivalencia

Se reprodujo el árbol final de #19 directamente sobre la rama limpia desde main con `git restore --source=1ea6494cac1c1b5769fe861fbb530fe6a348384f --staged --worktree -- .`. No se encadenaron merges ni cherry-picks. El historial nuevo tiene como padre el main indicado; no contiene los commits intermedios.

Antes de agregar los metadatos de esta tranche, `git write-tree` y el árbol de #19 devolvieron exactamente **504ff93bacb19f0f744c48fc45ccf04a06c58304**. Esto prueba igualdad de nombres, modos y blobs versionados, no sólo ausencia de conflictos.

**Diferencias permitidas contra #19: únicamente tres archivos nuevos en `docs/p0/consolidation/`: este informe, `inventory.json` y `verification.json`.** Runtime, package/lock, configuración, workflows, scripts, tests y documentación heredada permanecen idénticos a #19. No se regeneró el resumen de navegador heredado para hacerlo pasar por evidencia nueva: la ejecución de consolidación tiene su registro separado.

[Inventario completo](inventory.json): 140 archivos efectivos respecto de main antes de estos tres documentos: **59 añadidos, 81 modificados, 0 eliminados**. Clasificación: 84 runtime, 10 tests, 2 package/lock, 1 workflow, 10 tooling y 33 documentación. Con los metadatos propios: **143 archivos, 62 añadidos, 81 modificados, 0 eliminados**. Cada archivo fuente tiene su blob Git; las diferencias documentales propias se enumeran separadamente para evitar autorreferencias de hashes.

Cadena representada: **#4 → #5 → #6 → #7 → #8 → #9 → #10 → #11 → #17 → #18 → #19**. PR #1 Studio expresamente excluido: sus commits propios no coinciden con ninguno del rango main..#19; no se importó su rama. Las ramas/PRs históricos y main no fueron escritos. Documentación comercial heredada de #17 se conserva por equivalencia; no se implementó Home, funnel, SEO ni integración Studio nuevos. No se iniciaron #14–#16.

## Gates y evidencia

[Resultados nuevos](verification.json). Ejecutados en este worktree desde instalación frozen, con los scripts de #19 sin cambios:

Resultado local: **719 paquetes instalados, 70/70 tests, lint 0 errores y los mismos 8 warnings, build de 3152 módulos, 155 PASS navegador / 0 FAIL / 0 flaky / 1 exclusión desktop intencional**. El SHA-256 de `dist/index.html` también coincide con el build revisado de #19: `59078f6c9af7ea9ed440266bab78dfaae4a97352a0e430008ae45db2767e8206`. La evidencia remota final corresponde a los checks del nuevo PR y su head, enlazados en el cuerpo del PR.

```sh
npm ci --offline --ignore-scripts --no-audit --no-fund
npm run test:ci
npm run lint
npm run build:ci
npm run test:browser
```

Se mantienen Node 20.20.2/npm 10.8.2, lockfile exacto, 70 tests acumulados, configuración ESLint y sus reglas, y los tres gates CI: tests/build offline, lint offline, Chromium con sólo loopback en un namespace sin salida externa. Los reportes de navegador completos, capturas y auditorías por caso se adjuntan en el artifact del nuevo PR. La instalación de dependencias/Chromium en CI tiene acceso a sus distribuidores antes del aislamiento; las pruebas no contactan producción.

No se eliminaron tests, no se redujeron reglas, no se ocultaron warnings. La igualdad exacta de los archivos de tests/tooling contra #19 y el inventario permiten comprobarlo independientemente de un check verde. Las suites cubren 360/390/768/1440, rutas públicas/privadas, identity/admin/payment, inputs falsificados, red prohibida, teclado/foco, historial y navegación lenta. La exclusión desktop de un caso de menú móvil es la misma de #19; el desktop tiene navegación propia comprobada.

## Contenciones vigentes y alcance de la prueba

| Invariante | Fuente y prueba conservadas |
|---|---|
| Cliente/proveedor activo contenidos | `containedClientAuth.js`, `containedSupplierAuth.js`; suite identity: providers denegados, credenciales/caches falsificados, acciones tardías, logout y ausencia de transportes |
| Provider legacy contenido | `disabledProveedorAuth.js`; suite provider-containment |
| Sin autoridad cliente/proveedor desde localStorage; ID local no es bearer | `identityContainment.js`, transportes contenidos; pruebas de caches manipulados y Authorization antes de dispatch; rutas privadas denegadas en navegador |
| Admin UI deny-by-default sin user_metadata ni email | `ProtectedAdminRoute.jsx`; regresión admin anónimo, metadata/email falsos y rol de aplicación explícito; pruebas de navegador con sesiones fabricadas |
| Nuevos pagos frontend bloqueados | Hooks Mercado Pago/Stripe y wrapper; suite payment-containment con llamadas directas, repetidas y datos manipulados; botones públicos en navegador |
| Checkout no confirma pago por URL | `UnverifiedPaymentNotice`; tres rutas con query ausente, falsificada, contradictoria y malformada; no activan plan/créditos |
| Operaciones privadas contenidas no despachan red | VM/SSR con guard offline y spies de transportes, más auditoría de solicitudes por contexto browser y prueba adversarial del harness |
| Sin secreto productivo agregado | Ninguna diferencia de código/config contra #19; `.env*` tampoco cambia entre main y #19. Documentos nuevos sólo contienen referencias Git y evidencia sintética. Búsqueda adicional de patrones de private key/secret no encontró coincidencias en runtime/tooling/workflows; no constituye auditoría exhaustiva de secretos históricos. |

La sesión nativa usada para admin es una fixture local: demuestra UI, **no** autenticación, firma, RLS ni ownership servidor. Tampoco se generaliza la contención de cliente/proveedor a todo uso local de storage: persisten preferencias, cuotas y estado de UI heredados; no se habilita autoridad privada con ellos.

## Los mismos ocho warnings

Se conserva íntegra la [clasificación de #19](../WEB-BROWSER-EVIDENCE.md#los-8-warnings-revisados-individualmente). La nueva salida lint registra los mismos ocho `react-hooks/exhaustive-deps`, sin nuevos warnings:

- ManualQuoterPath/groupedServices: seguro bajo el montaje actual.
- Testimonials/nextTestimonial: seguro por setter funcional y dependencia de longitud.
- ChatWidget/initializeSession: deuda real, no montado.
- ProveedorProductos/fetchProductos: deuda real, mocks/timer, no montado.
- RenderWizardStep2/stopRecording: requiere corrección antes de reactivar grabación/render privado.
- ImageUploadPage/handleFile: dependencia segura hoy; deuda separada de revocación de object URLs antes de reactivar.
- PresupuestoPage/trackView: seguro con analytics actual de console al montaje.
- QuoterPage/checkUserPlan: requiere corrección de carreras/estado anterior para sesiones nativas.

Persisten también el aviso de chunk >500 kB y la deprecación del ESLint fijado. No se corrigió deuda ajena a esta consolidación. Copy comercial, analytics/consentimiento y operación real de formularios conservan los límites de #19.

## BLOCKED EXTERNO / REQUIERE BACKEND-OPERADOR

Permanecen sin cierre: **RLS, Storage, checkout Edge, links existentes, suscripciones, webhooks y firma, ownership backend, idempotencia/replay, revocación y pagos reales**. También persistencia/entrega productiva de formularios y uploads. Se requieren fuentes versionadas y evidencia del operador/backend; no se modificaron ni verificaron despliegues, infraestructura, bases o proveedores reales. El verde de esta rama no levanta esos bloqueos.

## Decisión, rollback e históricos

**Recomendación: NO MERGE ahora.** Una vez verdes los tres gates de este PR y demostrada la equivalencia, queda como candidato técnico para revisión explícita de Jona/Arkos. Esa revisión debe aprobar el diff acumulado respecto de main, las contenciones y las deudas. Un eventual merge de esta base no es autorización de deploy ni de habilitación de capacidades.

Rollback conceptual: mientras siga draft, descartar la propuesta deja main intacto. Si en otra decisión se integrara, revertir el commit de consolidación/merge mediante otro PR revisado, sin reset ni reescritura de main. Volver al main anterior también retiraría contenciones y tooling: no debe interpretarse como una alternativa segura para publicar ni resuelve estado externo.

Plan **condicionado** para históricos, a ratificar sólo después de la revisión de Jona/Arkos: tras la decisión de integrar este PR, marcar #4–#11 y #17–#19 como sustituidos por él y cerrarlos sin merge individual, con un enlace al consolidado; conservar sus evidencias y ramas hasta acordar retención. No aplicar ese cierre antes de comparar #19, tener CI verde, revisión y decisión explícita. PR #1 y Issues #14–#16 quedan fuera. Ningún histórico fue cerrado ni retargeteado durante esta tranche.

STOP: entrega del único draft contra main; sin merge, deploy ni continuación automática de otra tranche.
