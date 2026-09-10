# P0: estado de pago no verificado en los retornos web

Fecha: 2026-09-10. Base de desarrollo: `d986b38299ee07a92a0f31d219e8c24cf9226f66`
(PR #9), rama `codex/p0-web-payment-status-truth`. No se afirma que esta base ni
este cambio estén desplegados. No hubo acceso a servicios reales, secretos,
archivos de entorno, datos, proveedores de pago ni producción.

## Hallazgos y contención

Evidencia en los archivos de la base indicada:

| Hallazgo / severidad | Evidencia y recurso | Riesgo / dependencia | Solución y aceptación |
| --- | --- | --- | --- |
| Confirmación de éxito sin autoridad / alta | `CheckoutSuccessPage.jsx`: effect lee `status`, `payment_id`, `preference_id`; acepta `status=approved` o presencia de `payment_id`. Luego afirma pago exitoso, plan activado, créditos y comprobante enviado, con fecha local | Una URL arbitraria produce una confirmación visual sin verificación de pago ni titularidad. No demuestra una mutación de créditos | Eliminar lectura de query, estado/effect, ID/fecha derivados y botón de recibo sin funcionalidad. Siempre mostrar estado no verificado, también con URL vacía, malformada o contradictoria |
| Rechazo/ausencia de cargos no verificados / alta | `CheckoutErrorPage.jsx`: `status` selecciona explicaciones y el copy afirma que no hubo cargos ni facturas | Puede llevar a repetir una compra aunque exista un cargo real | Mismo aviso no verificado; quitar afirmación de rechazo/ausencia de cargos y llamada a reintentar. Conservar `/planes` con etiqueta neutral «Ver Planes» |
| Procesamiento y activación prometidos / alta | `CheckoutPendingPage.jsx`: refleja `payment_id` y afirma procesamiento, plazo de acreditación, futuro email y activación automática | Confunde una ruta de retorno con el estado efectivo y con procesos backend no comprobados | Mismo aviso sin ID, plazo ni promesas. Conservar ayuda del proveedor como enlace explícito, sin abrirlo automáticamente |

Las tres páginas están montadas en `App.jsx:200–202`, respectivamente en
`/checkout/success`, `/checkout/error` y `/checkout/pending`. Se conservan rutas,
nombres y exports. El segmento `success`, `error` o `pending` no es evidencia de
un resultado. Tampoco lo son parámetros, datos de navegador o identidad enviada
por el cliente.

Las páginas renderizan `UnverifiedPaymentNotice`, un componente compartido sin
datos de pago, estado, effect ni consulta. Las variantes sólo controlan enlaces
existentes, nunca el estado del pago. El mensaje indica que esta página no puede
verificar cargos/aprobación/rechazo/pendencia ni confirmar plan/créditos/comprobante;
invita a revisar el estado y comprobante en la cuenta del proveedor o contactar
soporte, y advierte que no se repita el pago sólo por este mensaje.

Se preserva navegación explícita al dashboard; su `ProtectedRoute` en App no se
altera ni se presenta como autorización de pagos. Inicio y contacto permanecen
disponibles. Error conserva planes; Pending conserva la URL de ayuda de Mercado
Pago con `target="_blank"` y `rel="noopener noreferrer"`. No hay redirecciones
al montar, reintento automático, checkout, descarga, email ni otorgamiento de
beneficios. El enlace externo sólo se sigue por decisión del usuario.

## Inventario y límites

`components/checkout/SuccessModal.jsx`, `PendingModal.jsx` y `ErrorModal.jsx` no
tienen imports consumidores encontrados en `src`. Se conservan sin modificaciones:
el primero todavía afirma activación/recibo y redirige con timer; los otros
presentan estados/reintentos no verificados. No reutilizarlos como confirmaciones
antes de una revisión de su contrato. La ausencia de imports es inventario
estático, no prueba absoluta de ejecución/imposibilidad de uso futuro.

Este cambio cierra las afirmaciones visuales de las tres rutas, no la conciliación
financiera. No verifica un pago real, no revoca enlaces ya emitidos ni cambia el
estado de cobros anteriores. Los hooks/wrappers de compra contenidos en PR #9
siguen intactos y deshabilitados. No se afirma bloqueo global de pagos ni del
servidor. El hallazgo de retorno de `PAYMENT-UI-CONTAINMENT.md` queda contenido en
estas rutas; su dependencia servidor continúa abierta.

Antes de mostrar un resultado real, se requiere un contrato de consulta del
backend canónico con autenticación y titularidad verificadas del lado servidor;
una referencia de pago arbitraria nunca debe revelar datos ajenos. El resultado
debe provenir de conciliación autoritativa con el proveedor, con manejo de
notificaciones auténticas, duplicados, retrasos, importes/moneda y auditoría.
Pago, activación, créditos y envío de comprobante son hechos distintos: no inferir
los tres últimos sólo de un pago aprobado. No se inventó ni conectó una API para
simular ese contrato. Debe definirse y probarse en otra tranche autorizada.

Aceptación futura: usuario anónimo/no titular no obtiene datos; URL falsificada
no confirma nada; estados desconocidos o fallos de consulta permanecen explícitos;
duplicados no duplican beneficios; sólo hechos conciliados y autorizados permiten
copy de aprobación/activación/créditos/comprobante. Estas pruebas servidor aún no
se ejecutaron ni se deducen de los tests UI.

## Verificación reproducible

Node **20.20.2**, npm **10.8.2**. `npm ci --offline --ignore-scripts --no-audit
--no-fund` instaló 716 paquetes desde caché local sin lifecycle scripts. No se
agregaron dependencias ni cambios al lockfile. Esbuild, Babel parser y React ya
están disponibles en el lockfile; no se instaló otro transformador JSX.

- `npm run test:ci`: **37/37**, incluidos nueve nuevos tests.
- Para cada página se compila sólo la sintaxis JSX del archivo original y del
  componente compartido con esbuild, se evalúan los módulos en VM y se renderizan
  con React SSR real. Router, botones e iconos son dependencias controladas.
  Diez fixtures por página cubren query ausente, aprobación/ID falsos, rechazo,
  pendencia, duplicados contradictorios, valor null, timeout, HTML y datos largos
  o malformados. Se comprueba HTML idéntico sin reflejar query ni afirmaciones
  antiguas, sin efectos ni navegación al renderizar. Los callbacks de botones se
  invocan y se verifican destinos exactos; la URL de ayuda se inspecciona sin abrir.
- AST de App comprueba las tres rutas/componentes, su registro único y destinos existentes. Otro
  chequeo verifica imports revisados y ausencia de lecturas/efectos peligrosos.
  El inventario de modales permanece explícitamente estático.
- `npm run build:ci`: **PASS**, 3149 módulos con configuración sintética y sin
  cargar archivos de entorno. Persisten Browserslist desactualizado y chunk
  principal de 597.26 kB como advertencias, no se ocultan.
- Lint específico de cuatro archivos de aplicación y test: **PASS**. Lint completo:
  **FAIL, 9 errores + 10 warnings**, igual al baseline. Ninguna regla se relajó.
- CI incluye el test nuevo en el gate offline existente. Guard JS local y
  `unshare --net` de CI se conservan; Windows local no es sandbox de red del SO.

No hubo servidor de desarrollo, navegador, prueba browser E2E, servicios reales ni
auditoría visual de layout. SSR no verifica funcionamiento del router real,
accesibilidad interactiva, entrega de soporte ni la página externa del proveedor.
El árbol global conserva providers y AuthErrorHandler: no se afirma que abrir
la URL completa no pueda hacer requests. La ausencia de consultas/efectos se
refiere a los cuatro componentes revisados. SSR no ejecuta efectos de commit;
el chequeo de fuente también rechaza useLayoutEffect/useInsertionEffect.
El build compila el árbol real, no ejecuta servicios. Preservar estos límites en
PRs y reportes de cierre.

## Revisión, despliegue y reversibilidad

El diff es sólo frontend, tests y documentación/CI; no hay migración de datos.
Dashboard, producción, Budget Engine V2 y Studio quedan intactos. La entrega se
prepara para revisión en PR borrador; no se ejecutan merge ni deploy. Un revert es
técnicamente posible, pero restauraría mensajes engañosos: cualquier rollback
debe preservar este aviso honesto o una alternativa autoritativa revisada. La
reactivación comercial y la conciliación requieren aprobación separada.
