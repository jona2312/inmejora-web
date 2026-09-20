# Issue #13 — evidencia de navegador y consolidación Web

Base: PR draft #18, `codex/p0-web-identity`, `0c2b9d4049411f2bb03536b5240e38b5dd041c2b`.
Alcance: exclusivamente `jona2312/inmejora-web`. Sin merge, deploy, operaciones reales, secretos ni cambios en Dashboard/Studio. Esta evidencia no autoriza release.

## Resultado local verificado

**PASS navegador:** 155 pruebas pasaron, 0 fallas, 0 flaky; una exclusión intencional del menú móvil en el proyecto desktop (que prueba su navegación de escritorio). Chromium 153.0.8010.12, 360/390/768/1440 px. **PASS base:** instalación frozen offline de 719 paquetes, 70/70 tests anteriores, lint 0 errores/8 warnings, build correcto. La confirmación remota de los tres gates pertenece a los checks del PR, no se infiere de estos resultados locales.

[Resumen legible por máquina](browser-evidence/browser-summary.json), con hash del HTML del build, resultados por prueba y errores de consola esperados. Capturas inspeccionadas de Home y diálogo en los cuatro anchos: [360](browser-evidence/contact-360px.png), [390](browser-evidence/contact-390px.png), [768](browser-evidence/contact-768px.png), [1440](browser-evidence/contact-1440px.png). El corpus completo se conserva en el artifact CI.

## Reproducción

Node 20.20.2 / npm 10.8.2. Chromium instalado por `@playwright/test` **1.63.0 exacto**, tres paquetes de desarrollo adicionales; ninguna dependencia de aplicación actualizada.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install chromium
npm run test:ci
npm run lint
npm run build:ci
npm run test:browser
node scripts/browser/summarize.mjs
```

Instalación y descarga del navegador requieren caché o acceso a sus distribuidores. Las pruebas no usan producción. `build:ci` desactiva `.env`, elimina variables VITE heredadas y compila URL/clave sintéticas. El servidor sirve únicamente `dist` en `127.0.0.1:4173`, sin proxy backend. No usar `npm run dev` para reproducir esta auditoría.

Antes de navegar, cada contexto intercepta todas las solicitudes, bloquea service workers y WebSockets, reemplaza imágenes, fuentes y scripts analíticos por fixtures, y sólo admite explícitamente datos públicos sintéticos. Ningún fixture hace `route.fetch`. Los transportes prohibidos abortan; una URL no clasificada falla la prueba aunque haya recibido un 503 sintético. Hay una prueba adversarial independiente del propio bloqueo. Las peticiones de esa prueba son provocaciones del harness, no de Web.

En Windows se agrega proxy de salida a loopback sin servicio y resolución DNS externa denegada en Chromium. En CI se ejecuta además todo el navegador/servidor dentro de `unshare --net`, con **sólo loopback habilitado**. La descarga de Chromium sucede antes de ese aislamiento. Los gates anteriores conservan su bloqueo de red completo. No se verificó tráfico, configuración ni estado desplegado de ningún proveedor.

El informe HTML, JSON, capturas de cada ruta y auditoría de red por prueba se publican como artifact `browser-regression-evidence` (14 días). Fixtures con `example.invalid`, personas y teléfonos sintéticos. La sesión nativa usada para probar el guard admin es fabricada localmente: demuestra únicamente comportamiento de UI, nunca autenticación real, firma, ownership o RLS.

Para inspección manual adicional:

```sh
node scripts/browser/inspect.mjs
# otra terminal, con el navegador ya aislado:
npm exec --yes --package=agent-browser@0.37.1 -- agent-browser --cdp 9223 snapshot -i
npm exec --yes --package=agent-browser@0.37.1 -- agent-browser --cdp 9223 screenshot inspection.png
```

## Cobertura y límites

Los proyectos Playwright cubren 360, 390, 768 y 1440 px, altura 900 px, Chromium real. No representan Safari, Firefox, dispositivos físicos, Core Web Vitals ni prestaciones de backend.

- 26 entradas públicas: Home, precios/planes, servicios, proyectos, tres catálogos, cotizador, contacto/presupuesto, nosotros/asistente, acceso/registro/recuperación, proveedores, tres retornos checkout, legales y 404.
- 14 rutas privadas: todos los portales cliente (incluidos renders, edición, upload y análisis), proveedor y los dos admin. Identidades locales falsificadas no abren cliente/proveedor; admin anónimo se deniega. Se prueban separadamente `user_metadata` falso y `app_metadata` admin en una sesión nativa sintética.
- Navegación móvil y escritorio, back/forward, foco básico, Escape, encierro del foco del diálogo, cierre y restauración de scrolling. Se demoran 600 ms los chunks de Home para comprobar anchors de Servicios/Proyectos/Atención personalizada.
- Botones de planes recorren todas las consultas disponibles sin checkout; login/registro permanecen deshabilitados; recuperación no contiene formularios ni anuncia operación completada. Los retornos adulterados siguen mostrando estado **no verificado** y su Dashboard termina en login denegado.
- Contacto conserva texto y dice que no envió/guardó. Lead público con 503 conserva datos. Presupuesto valida antes de consultar y muestra fallo/reintento cuando su lectura backend falla. No se certifica persistencia exitosa, entrega de mensajes, subida productiva de fotos ni aprobación real.
- Cotizador prueba vacío/reintento, fixture de servicio, selección manual y desmontaje/remontaje al cambiar de modo. No certifica precios ni presupuesto formal. Catálogo prueba una respuesta de estructura inválida.

Cada test de aplicación verifica ausencia de excepciones no capturadas, transportes prohibidos y solicitudes externas no clasificadas. Las pruebas de rutas comprueban contenido visible y overflow horizontal del documento. Los errores de consola esperados por fixtures 503 se adjuntan; no se anuncian como ausencia absoluta de errores de consola. Las capturas usan imágenes sintéticas y fuentes fallback: la composición editorial y métricas con assets reales no están certificadas.

## FAIL navegador → CORREGIDO

| Hallazgo reproducido | Cambio acotado | Evidencia de regresión |
|---|---|---|
| Escape no cerraba menú ni contacto; opciones del modal eran divs sin teclado | Menú con estado accesible, Escape, foco y limpieza; Contacto usa Radix ya instalado, links, cierre nombrado y retorno de foco | `navigation, history and contact keyboard`; `mobile menu Escape...`; captura anterior incluida |
| Contacto anunciaba `Mensaje enviado` por un timer sin transporte | Aviso permanente y error honesto al submit, sin reset ni éxito simulado | `contact form never reports...` |
| Carga lenta de Home dejaba anchors sin desplazamiento (desvío observado: 8612.5 px en prueba móvil) | Hash en navegación y observación del montaje, con cleanup al cambiar de ruta | `main navigation resolves lazy home anchors` |
| Payload de catálogo con estructura inesperada causaba `map is not a function` y pantalla blanca | Validación de arrays antes de actualizar estado; error visible | `catalog rejects malformed payload...` |
| Tarjetas de tipo de proyecto no eran accesibles por teclado | Botones `type=button` con `aria-pressed` | flujo de presupuesto |
| Etiqueta de servicio no seleccionaba su checkbox | Asociación `id/htmlFor`; nombre accesible para superficie | flujo manual del cotizador |

Los primeros errores del harness (scripts analíticos aún no clasificados, assets con nombres de pagos confundidos con endpoints, selectores de encabezados ocultos y conteo antes de resolver lazy) se corrigieron en el harness. No se presentan como defectos de producto. El payload malformado inicial no representaba un contrato real; se mantuvo como prueba negativa de robustez y el fixture normal usa `colors/products` según el consumidor Web.

## Los 8 warnings, revisados individualmente

No se agregaron supresiones ni dependencias para ocultarlos.

| Ubicación | Clasificación | Razonamiento y condición |
|---|---|---|
| `ManualQuoterPath` / `groupedServices` | Seguro y justificado en flujo actual | Inicializa sólo la primera categoría. El padre carga antes de montarlo y lo desmonta durante recarga. Cambiar selección no debe reinicializar expansión. Probar actualización en caliente antes de cambiar ese contrato. |
| `Testimonials` / `nextTestimonial` | Seguro y justificado actualmente | El callback del intervalo sólo usa setter funcional y longitud, incluida en deps; timer se limpia. Componente no montado por rutas actuales. |
| `ChatWidget` / `initializeSession` | Deuda real | No montado. Inicialización lee cache y modifica cuotas de UI; hacerla explícitamente idempotente y estable antes de reusar. No tratar cache como identidad autorizada. |
| `ProveedorProductos` / `fetchProductos` | Deuda real | No montado; timeout y productos simulados, sin cleanup. Requiere contrato y estados honestos antes de activarlo. No hay CRUD proveedor certificado. |
| `RenderWizardStep2` / `stopRecording` | Requiere corrección antes de reactivar | Closure de `isRecording` potencialmente vieja; cleanup sólo limpia timer y no detiene reconocimiento/tracks. Render privado permanece denegado; no se abrió micrófono. |
| `ImageUploadPage` / `handleFile` | Seguro respecto a dependencia actual; deuda de recursos separada | La función capturada usa constantes y setters estables, sin estado reactivo consumido. URLs de objeto necesitan revocación al reemplazar/desmontar antes de reactivar. Ruta denegada. |
| `PresupuestoPage` / `trackView` | Seguro y justificado actualmente | Hook actual sólo escribe console con path/timestamp al montaje, sin proveedor ni estado capturado. Revaluar estabilidad/deps al instrumentar analytics real. |
| `QuoterPage` / `checkUserPlan` | Requiere corrección para sesiones nativas | Deps incluyen user, pero consultas async no tienen cancelación ni descarte de respuesta vieja; error puede conservar plan anterior. La prueba anónima no certifica cambios entre usuarios nativos. No es autorización de compras. |

Además: bundle principal supera 500 kB; eslint instalado emite aviso de versión sin soporte; SDK Supabase y Header todavía tienen contratos de presentación diferentes; hay copy comercial de renders/precios y funciones no disponibles que debe reconciliarse en la tranche comercial autorizada. Scripts analíticos se solicitan antes de elegir cookies: aquí fueron interceptados, no certificamos consentimiento operativo. No se ampliaron Issues #14–#16.

## BLOCKED — REQUIERE BACKEND/OPERADOR

| Superficie externa | Evidencia necesaria para levantar bloqueo |
|---|---|
| Edge checkout / links existentes | Fuente versionada, revisión de permisos y prueba de contención del despliegue/links por operador |
| Suscripciones/cargos recurrentes | Inventario y estado del proveedor confirmado por operador, sin inferirlo desde Web |
| Webhooks / firma | Handler versionado, verificación de firma y rechazo de firmas/eventos inválidos |
| Ownership | Validación servidor de sesión, titular del pago y recurso; pruebas negativas cruzadas |
| Idempotencia / replay | Persistencia y claves únicas, reintentos concurrentes y eventos duplicados |

No hay evidencia nueva de esas superficies en esta ejecución; no se accedió a producción ni se leyó Dashboard porque no era necesario para afirmar ese límite. Los tests Web y el guard `app_metadata` no levantan ninguno de estos bloqueos. Referencias previas: [contención de pagos](PAYMENT-UI-CONTAINMENT.md), [verdad del retorno](PAYMENT-RETURN-TRUTH.md), [identidad](WEB-IDENTITY.md).

## Recomendación de integración — REQUIERE DECISIÓN

Cadena: **#4 → #5 → #6 → #7 → #8 → #9 → #10 → #11 → #17 → #18 → esta tranche**. El inventario contemporáneo está en `browser-evidence/pr-inventory.json`; #5–#10 conservan checks históricos rojos de lint, #11/#17/#18 están verdes. #4 carece de esos checks. #1 queda fuera de esta cadena.

Recomiendo **un PR acumulado de consolidación contra main**, creado posteriormente desde la punta validada, con comparación completa contra main y los tres gates sobre ese head. Evita integrar pasos intermedios conocidos con lint rojo. Revisar diff global, migración del lock y contenciones; luego decidir cómo cerrar/sustituir los drafts. No recomiendo retargetear y mergear cada eslabón sólo por tener un verde en la punta. No se ejecutó ninguna estrategia.

La entrega es candidata técnica a preparar esa revisión de consolidación **con capacidades contenidas**. No es candidata a release, habilitación de pagos/identidad, ni demuestra operación comercial de extremo a extremo. Aceptación de las deudas anteriores, copy de capacidades y evidencia externa siguen pendientes de Jona/Arkos. No iniciar #14–#16 automáticamente.
