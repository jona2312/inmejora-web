# P0 Web — consolidación auditada y corrección de registro con plan

**PR #20 sigue DRAFT. HOLD para merge; NO deploy.** Actualización autorizada por Jona/ARKOS tras ratificar el checkpoint 2026-09-20.

## Revalidación anterior al cambio

- Main: 0388791316d3ea7b9a03257cd46fa36b0465dda8.
- Head anterior #20: 71db9715199cd7539fdd3579d185cfb6db53ee49; un único commit, padre directo main; sin drift.
- Fuente histórica #19: 1ea6494cac1c1b5769fe861fbb530fe6a348384f.
- Árbol #19: 504ff93bacb19f0f744c48fc45ccf04a06c58304. Árbol anterior #20: e5a2759aaf136e81dc9d9af78169638131a3da50.
- Se compararon árboles Git completos, no truncados: los 321 archivos de #19 conservaban path/blob/mode en #20; sólo se añadían REPORT, inventory y verification. No se usó el diff de tres puntos como prueba de equivalencia directa.

La consolidación original reprodujo #19 desde main sin integrar commits intermedios. Esa equivalencia es **histórica**: después de esta corrección ya NO se afirma igualdad exacta de runtime/tests con #19.

## Único delta funcional autorizado

| Archivo | Cambio respecto de #20 anterior |
|---|---|
| src/pages/RegistrationPage.jsx | Una sustitución de texto para la variante con plan: “Puedes crear tu cuenta; los pagos están temporalmente no disponibles.” → “El registro y los pagos están temporalmente no disponibles.” |
| tests/browser/regression.spec.mjs | Una regresión de /registro?plan=pro_mensual, ejecutada en cuatro viewports. Se conservan todas las pruebas anteriores. |
| docs/p0/consolidation/REPORT.md | Revalidación, alcance, impacto de integración, evidencia y HOLD actualizados. |
| docs/p0/consolidation/inventory.json | Inventario histórico conservado bajo una clave explícita; delta nuevo y blobs de fuente separados. |
| docs/p0/consolidation/verification.json | Evidencia histórica separada de la ejecución nueva; no reutilizar conteos antiguos como resultado actual. |

Son cinco archivos modificados frente al anterior #20, sin altas ni bajas. Frente a #19: dos modificaciones de fuente/test y los tres documentos de consolidación añadidos. Frente a main: siguen siendo 143 archivos, 62 añadidos y 81 modificados.

No cambian auth providers, handlers, hooks de pago, rutas, planes, suscripciones, package/lock, workflows ni restricciones de red. No se reactiva registro ni checkout; tampoco se agrega un nuevo fallback o feature comercial. El enlace de regreso a Home y los canales manuales existentes permanecen.

## Regresión específica y alcance

El nuevo caso usa el build real y los providers contenidos, no una implementación alternativa del formulario. Comprueba:

1. /registro?plan=pro_mensual permanece en esa ruta; mensaje visible de registro y pagos temporalmente no disponibles.
2. Seis inputs (incluidos términos) y acción de envío inicialmente deshabilitados; ausencia de la promesa anterior.
3. Intento adversarial sólo en el DOM sintético: habilitar inputs de la fixture, introducir datos ficticios válidos y despachar submit. La aplicación no se modifica ni se habilita; el submit sigue deshabilitado y el provider real rechaza el intento.
4. Resultado “Error al registrarse”, no error de validación; así el test comprueba la contención del provider y no sólo un formulario vacío.
5. Ninguna identidad/token cliente en localStorage, navegación al portal, popup, bienvenida, redirección a Mercado Pago ni toast del hook checkout.
6. Cero solicitudes distintas de GET; cero intentos de registro/checkout/Mercado Pago/Stripe; auditoría forbidden/unexpected vacía.

“No se crea cuenta” se acredita dentro del flujo Web por rechazo efectivo y ausencia de transporte/escrituras de identidad. No es una prueba de autorización de un backend productivo. Los demás tests de identidad y pagos se conservan, incluidas llamadas directas a providers/hooks.

El caso se ejecuta a 360/390/768/1440 px y adjunta captura del estado inicial y auditoría de red. Se conserva la exclusión desktop intencional del test de menú móvil; no se añaden skips ni retries.

## Gates nuevos

Estado de esta actualización: **PENDING CI**. Los tres gates deben volver a ejecutarse; no se atribuye a este nuevo árbol el verde histórico de 70 tests y 155 casos browser. La regresión añade cuatro ejecuciones de navegador; el recuento final se actualizará sólo con evidencia.

La verificación completa se ejecuta en el pipeline existente, no se presenta como una ejecución local. Localmente sólo se comprueban sintaxis e integridad del delta/documentos. Node 20.20.2 / npm 10.8.2; instalación frozen sin lifecycle scripts; lock y dependencias intactos.

Tests/build/lint conservan el namespace sin red del sistema operativo. Playwright conserva namespace con sólo loopback, service workers bloqueados, intercepción previa a navegación, proxy restrictivo y bloqueo DNS. Dependencias y Chromium se descargan antes de aislar las pruebas; ninguna prueba contacta servicios productivos. No se ejecuta servidor de desarrollo contra APIs reales.

Se conservan las ocho advertencias históricas de react-hooks/exhaustive-deps y su [clasificación](../WEB-BROWSER-EVIDENCE.md#los-8-warnings-revisados-individualmente). No se eliminan tests, cambian umbrales, reglas, scripts ni warnings para obtener verde. Los artifacts de esta corrida son evidencia nueva; los screenshots y browser-summary heredados de #19 no se reetiquetan.

## Impacto de un eventual merge

| Superficie | Comportamiento del candidato |
|---|---|
| Registro/login/gestión de cuentas cliente y proveedor | Contenidos; no se obtiene identidad privada de caches o IDs locales. El copy con plan ahora reconoce esa indisponibilidad. |
| Portales/renders/uploads privados | Rutas contenidas; no se habilita operación privada por este PR. No certificar privacidad del recurso backend por bloquear la UI. |
| Admin UI | Deny-by-default, sin autoridad desde email/user_metadata; fixture de app_metadata prueba UI, no sesión servidor ni RLS. |
| Nuevas compras | Hooks MP/Stripe y wrappers frontend contenidos; no se inicia checkout ni se activa plan/suscripción. |
| Retorno checkout | Estado no verificado incluso si la URL indica éxito; no se otorgan beneficios. |
| Home, navegación y contenido público | Se mantienen rutas públicas, catálogo/cotizador y sus estados de error; los datos/servicios reales conservan dependencias externas no certificadas por fixtures. |
| Formularios públicos | Los flujos preservados siguen sus contratos actuales; Contacto informa que no envía ni guarda. No generalizar su contención a todos los formularios ni prometer persistencia real. |
| Contacto manual | Se conservan Home/Contacto y modal existente con WhatsApp de Jona (+54 9 11 5830-0611) y hola@inmejora.com. No se abren conversaciones ni se envían mensajes en tests. No se certifica entrega/disponibilidad/SLA humano. |
| Studio | Fuera de alcance; Web #1 no se incorpora. |

El cambio de una línea no agrega una función comercial. Las indisponibilidades anteriores del consolidado deben aceptarse explícitamente antes de integración.

## Production provenance y riesgo de merge

**UNKNOWN / BLOCKED**: no se pudo vincular inmejora.com con un repositorio, rama, SHA y digest productivo confiables.

Inspección read-only de la web pública mediante fetch: HTML mínimo, sin identificador de despliegue verificable. Intento HEAD público desde el entorno local: bloqueado por permisos de socket; no se usaron credenciales ni se modificó infraestructura. El estado de commit main consultado no contiene statuses que aporten provenance. Estos negativos no prueban ausencia de deployment.

El único workflow GitHub inspeccionado ejecuta checks de pull_request/workflow_dispatch y no contiene deploy. La configuración externa de Coolify no es accesible en este flujo sin credenciales. **Trigger ante merge a main: UNKNOWN.** Un comentario de “trigger redeploy” en código no es evidencia de un hook actual. No se cambió Coolify, reinició servicio, consultó .env ni utilizó credencial productiva.

Antes de merge, el operador debe aportar metadata saneada: repo/branch/SHA, build/artefacto/digest y fecha vinculados al dominio, más evidencia de si un merge dispara despliegue automático. No es seguro tratar merge y deploy como independientes hasta comprobar ese circuito.

## Lo que NO certifica el PR

No cierra Backend, Supabase, RLS, Storage, ownership, identidad/sesiones servidor, revocación, ledger, firma webhooks, idempotencia/replay, reconciliación financiera, links/suscripciones existentes ni pagos reales. Tampoco prueba precios actuales, entrega de formularios/WhatsApp o aislamiento de fotos en producción. No se tocaron Edge, Dashboard, Supabase, secretos ni Studio.

## Recomendación y handoff

**HOLD para merge** hasta revisión Jona/ARKOS, provenance y efecto del trigger externo, aunque los gates técnicos estén verdes. Mantener draft; no merge ni deploy.

Los históricos #4–#11 y #17–#19 siguen intactos. Sólo después de revisión y decisión de integración autorizada pueden marcarse superseded por #20 y cerrarse sin merges individuales. Preservar evidencia/ramas según retención acordada.

La reversión puntual de esta corrección devolvería una promesa falsa; preferir una corrección hacia adelante. Revertir el consolidado completo puede retirar contenciones, por lo que no es un rollback productivo seguro automático.

STOP tras actualizar #20 y verificar CI. Los [datos de verificación](verification.json) fijan el SHA probado y el cuerpo del PR enlaza la CI del head final.
