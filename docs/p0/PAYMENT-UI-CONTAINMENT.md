# P0: contención de entradas de compra web (no bloqueo global de pagos)

Fecha: 2026-09-10. Base: `4bd63f63b25d32147140bc7885e1b43f163597f2`
de `inmejora-web`, rama de trabajo `codex/p0-web-payment-containment`.
La base no se afirma desplegada. Este cambio es local/de desarrollo: no despliega,
no rota credenciales, no modifica Supabase, proveedores de pago ni infraestructura.
No se leyeron archivos de entorno ni valores de credenciales.

## Hallazgos, dependencias y aceptación

Referencias de evidencia sobre la base anterior, antes de sustituir las llamadas:

| Hallazgo / severidad | Evidencia / recurso | Riesgo y dependencia | Solución / prueba de aceptación |
| --- | --- | --- | --- |
| Entradas de checkout directas / alta | `src/hooks/useMercadoPagoCheckout.js`, `src/hooks/useMercadoPago.js`: POST a Edge `checkout`; `useStripeCheckout.js`: POST a `/api/horizon/checkout` | El frontend puede iniciar compras; los controles del navegador no prueban autorización ni importes del servidor. Fuente de Edge `checkout` ausente del código versionado inspeccionado | Estos tres hooks notifican indisponibilidad sin transporte, identidad, almacenamiento ni redirección; inputs arbitrarios y clics concurrentes no habilitan compra |
| Token privado referenciado por cliente / alta | `src/utils/mercadoPagoAPI.js`: ambos métodos enviaban `VITE_MERCADO_PAGO_ACCESS_TOKEN` como `mpToken` al backend | Si fue configurado e incluido en un bundle, el token privado de Mercado Pago queda disponible para quien recibe el cliente; uso efectivo no verificado | Eliminar importación de API y toda lectura/envío del token; ambos métodos rechazan incluso llamadas directas. **ROTATION REQUIRED si fue configurado/expuesto**; procedimiento debajo |
| Registro promete redirección y queda cargando / media | `src/pages/RegistrationPage.jsx`, rama de éxito con `?plan` | El callback contenido retorna sin navegar; el caller anunciaba redirección a Mercado Pago y no liberaba `isLoading` | Quitar promesa, informar indisponibilidad en la página y liberar carga con `finally` tras checkout; handler real probado para éxito y fallo de notificación, sin navegar |
| Confirmación de pago por URL / alta, pendiente | `src/pages/CheckoutSuccessPage.jsx`, ruta `/checkout/success` en `App.jsx`: acepta `status=approved` o presencia de `payment_id`, luego afirma activación/créditos/recibo | Parámetros manipulables producen una confirmación visual sin conciliación probada. No prueba que haya mutación de créditos | PR separado: consultar estado autenticado y autorizado, conciliado por servidor; nunca inferir pago/beneficios desde URL. Aceptación: URL falsificada no confirma pago, activación ni envío de comprobante |

## Contratos conservados y uso de cada entrada

- `useMercadoPagoCheckout(hookProductId = null)` conserva
  `{handleSubscribe, loadingProductId: null, hookProductId}`;
  `handleSubscribe(params)` ignora los datos de compra.
- `useMercadoPago()` conserva `{handleCheckout, loadingProductId: null}`;
  `handleCheckout(productId, planName)` ignora ambos argumentos.
- `useStripeCheckout()` conserva `{loading: false, error: null, initiateCheckout}`;
  `initiateCheckout(productId)` no inicia operación ni error de red ficticio.
- Cada callback de hook resuelve sin compra y muestra
  «Pagos temporalmente no disponibles». No es una confirmación de pago.
- `mercadoPagoAPI.createCheckout(planId)` y `createPreference(productId)` conservan
  nombres/parámetros/promesas, pero ahora rechazan siempre con código
  `PAYMENTS_TEMPORARILY_UNAVAILABLE` y mensaje fijo en español. No hay consumidores
  importados encontrados; un futuro caller debe manejar este rechazo explícito.
- No hay flag de navegador, identidad local ni configuración que reactive estas
  cinco funciones: habilitarlas requiere un cambio de código revisado.

Inventario de imports de `useMercadoPagoCheckout`: `PricingCard`, `CheckoutPage`,
`PlansPage` y `RegistrationPage`. `PricingCard` conserva `PLANES_ACTIVOS=false` y
su recorrido de contacto; `PlansPage` conserva contacto. `CheckoutPage` conserva
su estado de planes en actualización y no tiene ruta encontrada en `App.jsx`.
`/registro` sí está montado y su query `plan` llegaba al callback tras registro.
La rama gratuita conserva su mensaje y navegación diferida al portal.

`useMercadoPago` no tiene consumidores importados encontrados. `useStripeCheckout`
tiene uno: `PlanSelectionModal`, sin montaje encontrado; su copy legado de Stripe
queda como deuda antes de reutilizarlo, aunque el hook ya no permite compra.
El test de inventario es estático, no una prueba de reachability completa.

## ROTATION REQUIRED: token de Mercado Pago potencialmente expuesto

No se obtuvo, imprimió ni verificó el valor. El hallazgo es la referencia a un
secreto de proveedor mediante una variable pública `VITE_*`, no una confirmación
de que la variable estuviera configurada en producción.

Si se configuró o distribuyó: identificar con el dueño el Access Token privado de
la aplicación/cuenta Mercado Pago que abastecía `VITE_MERCADO_PAGO_ACCESS_TOKEN`;
revocarlo y emitir reemplazo con el proveedor, sustituirlo sólo en el almacén
servidor autorizado y quitar esa variable del build/frontend. Revisar bundles,
cachés/CDN y artefactos históricos sin reproducir el valor; retirar artefactos
expuestos sólo con inventario y autorización. No basta borrar la referencia actual.
Inventariar antes las integraciones que usan ese token para coordinar la rotación.
No se solicita rotar una public key o anon key como si fueran este token privado.
Esta tarea no ejecuta ninguna de esas operaciones.

## Pruebas realizadas y límites

Entorno local: Node 20.20.2 / npm 10.8.2. `npm ci --ignore-scripts --no-audit
--no-fund` instaló 716 paquetes; no se cambiaron dependencias ni lockfile.
La instalación puede usar el registro; las verificaciones siguientes cargan el
guard de red existente, no archivos de entorno ni clientes reales.

- `npm run test:ci`: **28/28** (14 existentes + 14 de pagos/registro).
- Los tests de hooks y wrappers evalúan sus módulos ESM originales en VM; sólo
  se sustituye `useToast`. Cualquier otra dependencia falla al enlazar. Se atrapan
  transporte, almacenamiento, entorno, navegación, temporizadores y logs, incluso
  intentos cuya excepción se ocultase. Se prueban tipos arbitrarios, objetos con
  getters hostiles, configuración/usuario falsificados y 20 llamadas concurrentes.
- RegistrationPage se parsea con Babel ya presente en el lockfile; se extrae el
  handler por offsets AST y se ejecuta su cuerpo original sin reescribirlo, con
  fixtures de registro/validación/estado. Su caso `?plan` usa el hook contenido
  real. Se prueban liberación de carga, fallo de notificación, rama gratuita,
  registro denegado y validación fallida. No prueba el formulario completo en React,
  el backend de registro, sus validadores reales ni sus fallos de transporte.
- `npm run build:ci`: **PASS**, 3148 módulos; env sintético. Persisten advertencias
  de Browserslist desactualizado y chunk principal de 597.20 kB.
- Lint específico de los cinco archivos de aplicación cambiados y el test: **PASS**.
  Lint completo: **FAIL, 9 errores + 10 warnings**, igual al baseline previo.
  No se bajaron reglas, silenciaron errores ni editaron pantallas ajenas.
- CI incorpora estos tests al gate existente, con `--experimental-vm-modules`;
  el aviso experimental de Node queda visible. CI mantiene `unshare --net`; la
  verificación Windows local tiene guard JS, no aislamiento de red del SO.

No hubo prueba de pago, tráfico a checkout/Supabase, browser E2E ni deploy.
Esta contención no protege llamadas directas al servidor, no invalida enlaces de
pago ya emitidos y no demuestra que producción ejecute estos archivos. P0 sigue
abierto: versionar/verificar el Edge desplegado y su procedencia, cerrar emisión
de compras del lado servidor, revisar firma/idempotencia de webhooks, titularidad,
precio/moneda/importes y otorgamiento de créditos conciliado antes de reactivar.
La documentación de [autenticación de Edge Functions](https://supabase.com/docs/guides/functions/auth)
se usó para mantener explícita la separación entre contención UI y autorización.

`inmejora-web` sigue siendo frontend comercial; no hay cambios dashboard,
Budget Engine V2, tablas/datos ni Studio (0 cambios). Revertir el diff es posible
sin migración; restaurar las llamadas de compra antiguas no es un rollback seguro
sin autorización y controles servidor verificados. No ejecutar despliegue ni
reactivación automática a partir de este informe.
