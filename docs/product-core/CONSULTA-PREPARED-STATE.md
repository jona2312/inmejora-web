# Consulta corregida: preparación y copia coherentes

Base preservada: Web #35, `4b9aefa6b9cdb7a90832a365b3f2af664dc9c88a`.
Rama hija: `codex/web-consulta-prepared-state`. Verificación local: 2026-10-30.

Después de preparar una consulta, modificar un campo conservaba el enlace y el
texto anteriores. Por ejemplo, el formulario mostraba Quilmes y la acción
«Abrir WhatsApp» todavía contenía Hudson. Una copia asíncrona anterior también
podía confirmar «Texto copiado» para una consulta diferente.

`ConsultaForm` invalida la preparación al editar, conserva todos los campos y
requiere preparar otra vez el texto actualizado. Cada preparación tiene una
versión local; la finalización de una copia anterior no modifica la confirmación
de la preparación actual. No cambia el formato del mensaje ni la autoridad de
Core. La página continúa indicando «Todavía no fue enviado». Una ventana de
WhatsApp ya abierta no puede modificarse desde la Web; la corrección afecta las
acciones posteriores del formulario.

## Verificación

Runtime utilizado: Node `v20.20.2`, npm `10.8.2`, lockfile existente.

| Gate | Resultado |
|---|---|
| `npm run test:ci` | 108/108 PASS, guard offline |
| `npm run build:ci` | PASS, guard offline, 3133 módulos |
| `npm run lint` | 0 errores, 8 warnings preexistentes fuera del cambio |
| `node node_modules/@playwright/test/cli.js test tests/browser/sales.spec.mjs --output=test-results/consulta-prepared` | 145/145 PASS, Chromium, 360/390/412/768/1440 px |
| Recaptura del caso corregido, tras fijar scroll inicial en el test | 5/5 PASS; sólo cambió la toma de evidencia |
| Lint de `ConsultaForm.jsx` y `sales.spec.mjs` final | PASS sin warnings |
| Manifests `private-gallery` e `issue100` | PASS |
| `git diff --check` | PASS |

Las dos regresiones nuevas prueban:

1. Hudson → Quilmes; desaparecen enlace/copia anteriores; se conservan servicio,
   descripción y medidas. Una corrección inválida enfoca localidad y no abre otra
   ventana. El nuevo mensaje contiene Quilmes y medidas corregidas.
2. Copia pendiente → edición → nueva preparación → finalización tardía de la copia
   anterior: no muestra «Texto copiado». La copia del nuevo texto sí lo confirma.

El harness existente intercepta `window.open`, bloquea red externa/WebSockets y
comprueba ausencia de escrituras backend. Todo el contenido es sintético. El
primer arranque de Playwright sufrió EPERM al limpiar un directorio previo en
Windows; se usó una salida nueva y ejecución autorizada fuera del sandbox. No se
modificó el producto para sortear esa incidencia. Las suites completas terminaron
sin fallos.

## Capturas y hashes

Capturas locales: `test-results/consulta-prepared-final/sales-sales-launch-mode-ed-5f76b-nks-without-losing-the-form-{ancho}px/consulta-corrected.png`.
El test adjunta `consulta-corrected` al reporte Playwright; CI conserva capturas
en el artefacto existente `browser-regression-evidence`. Los PNG locales no se
incorporan al repositorio.

| Ancho | SHA-256 PNG local |
|---|---|
| 360 | `a3af790e35e560d6bc17dd89b07c2ada78b3a717a5488b825e1aad6969df4006` |
| 390 | `73ee24998f75932abc3b262de2a3081822f02f03cdb54627d7ee99bd394accb3` |
| 412 | `ce5107eb4f1f695f14e10b5b9bdb0bedb58d4ea69195e9bded23980d79f7a17e` |
| 768 | `10707a852b86d1b965e8d79e49c13236a56a1fbc87002ca13ade52de7ee0ca4b` |
| 1440 | `ea6f04dc2dc35506b7b4f162b0a1ae94c44d806bde13e6f3a7366ebe3c3dfb17` |

Hashes de fuente UTF-8 normalizada LF, acreditados por los generadores existentes:

- `ConsultaForm.jsx`: `12c9bf3bf296732a63b0dfd9d3e930a7927f8647ec24ca4be01b6824bf06070e`.
- `sales.spec.mjs`: `83f43d3c8a6a248e982e75e9609ec3fb0720c099a6cc15fa0340defc24303ec0`.

Se regeneraron únicamente `private-gallery-manifest.json` e
`issue100-manifest.json` con sus scripts actuales: cubren el componente y la
suite, y el segundo incluye el hash del primero. Sus contratos/base histórica y
scripts permanecen intactos.

## Alcance de entrega

Sin dependencia de #108, Auth ni infraestructura nueva. Sin cambios de API,
contratos, galerías, créditos, precios, Core o configuración de canales. No hubo
WhatsApp real, proveedores, deploy ni cambios productivos.

El workflow revisado sólo ejecuta pruebas/build/lint sobre `pull_request` o
`workflow_dispatch`, con `contents: read`; no despliega. CI remoto y revisión
independiente quedan pendientes de abrir el PR Draft sobre Web #35. Rollback de
código: retirar este commit hijo, preservando la base; no hay migraciones.

`C2_LIVE_PREFLIGHT = HOLD`.
