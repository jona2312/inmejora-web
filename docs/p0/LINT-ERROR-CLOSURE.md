# P0.7 web: cierre de nueve errores de lint, no de los warnings

Fecha: 2026-09-10. Base de desarrollo `ebb7183faedb154ec720d899689a04818ad9e10c`,
rama `codex/p0-web-lint-errors`. No se afirma que el código esté desplegado.
Alcance: nueve diagnósticos en cuatro archivos de aplicación, diez tests de
regresión y su incorporación al gate offline. No se modificaron reglas de ESLint,
dependencias, lockfile, contención de pagos, autenticación de servicios ni cotizador.

## Hallazgos, semántica y aceptación

| Hallazgo / severidad | Evidencia en la base / recurso | Riesgo y dependencia | Cambio / aceptación |
| --- | --- | --- | --- |
| Condición constante / baja, calidad | `WhyInmejora.jsx:107`, `false &&` envuelve tabla comparativa ya oculta | Gate rojo; reactivar tabla reintroduciría comparaciones absolutas sin respaldo | Eliminar exclusivamente JSX inalcanzable, array exclusivo `comparisonData` e imports exclusivos `CheckCircle2`/`XCircle`. Conservar las cuatro tarjetas visibles y no renderizar tabla ni comparaciones |
| Nombre global sombreado / baja, calidad | `CreditsWidget.jsx:7`, import `Infinity` de Lucide | Confunde el icono con el global numérico; gate rojo | Alias local `InfinityIcon` del **mismo export** y cambio de referencia JSX. Conservar icono, cálculos, copy, planes, condiciones y navegación |
| Tres escapes redundantes / baja, calidad | `FormValidation.js:22`, escapes de `+`, `(`, `)` dentro de clase de caracteres | Gate rojo, sin fallo funcional demostrado en el regex original | Quitar sólo esos tres escapes. Mantener dígitos, whitespace, guion, más y paréntesis; límite 6–20 tras trim, campo opcional y mensajes originales |
| Cuatro accesos a método del dato recibido / media, robustez de formulario | `authValidation.js:83,88,93,98`, `formData.hasOwnProperty(...)` | Prototipo nulo provoca excepción; un método sombreado puede omitir validación o fallar. No constituye por sí mismo bypass de autenticación servidor | `Object.prototype.hasOwnProperty.call` para name/email/password/phone. Validar propias incluso no enumerables/prototipo nulo/método sombreado, ignorar heredadas y conservar validadores/mensajes |

La única diferencia funcional intencional es la robustez de `validateForm` frente
a objetos sin el método heredado o que lo sombrean. Se mantiene la política de
campos opcionales: un objeto sin campos propios reconocidos sigue dando válido.
`null` y `undefined` siguen rechazándose mediante `TypeError`; no se inventó una
política nueva para datos de tipo arbitrario, getters o proxies hostiles.

No se unificaron los dos módulos de validación: `FormValidation` permite nombres
de dos caracteres y recorta email; `authValidation` exige tres y mantiene su
política original de email/teléfono/contraseña. Son reglas de formulario, no
identidad, ownership ni autorización. Este PR no las declara suficientes para
seguridad de producción.

## Dependencias y consumidores revisados

- `LandingPage.jsx` importa y renderiza `WhyInmejora`; la tabla estaba detrás de
  `false &&` y no tenía uso visible. Se quitó markup HTML muerto, **no tablas de
  base de datos ni infraestructura**. Se recupera del commit base si se requiere
  una revisión histórica; no debe reactivarse sin evidencia del contenido.
- No se encontraron imports consumidores de `CreditsWidget` en `src`; se conserva
  su módulo y contrato. Los datos y textos de suscripción/ilimitados se probaron
  sólo como fixtures de regresión, no como validación del producto ni autoridad
  de créditos. No se tocó `SubscriptionContext`.
- `components/lead/RegistrationModal.jsx` consume `FormValidation`.
- Login, registro, recuperación y perfil consumen validadores individuales de
  `authValidation`. No se encontró import consumidor de su `validateForm`.
  El helper local homónimo de `PresupuestoPage` es independiente y no se modificó.
- El inventario anterior es búsqueda estática, no prueba browser de reachability.

## Pruebas y resultados

Node 20.20.2 / npm 10.8.2. Instalación local:
`npm ci --offline --ignore-scripts --no-audit --no-fund`, 716 paquetes desde caché,
sin lifecycle scripts. No hubo lectura de archivos de entorno ni acceso a servicios.

- `npm run test:ci`: **47/47** (37 previos + diez nuevos).
- Los dos módulos de validación se importan originales, sin reemplazar cuerpos.
  Fixtures cubren nombres/email, teléfono opcional/formateado y límites,
  los 128 caracteres ASCII y whitespace/Unicode representativo; reglas de
  contraseña, match y límites; formularios propios ordinarios, frozen,
  prototipo nulo, método sombreado/falso/que lanza, campos heredados con getters
  que no deben leerse, campos propios no enumerables y entradas null/undefined.
- Los componentes originales se compilan sólo de JSX a JS con esbuild ya
  disponible y se renderizan con React SSR en VM. Se controla contexto/UI/router/
  animación/iconos para no cargar proveedores reales. Se verifican cuatro tarjetas
  sin tabla, binding AST del icono original, créditos finitos/porcentaje, plan de
  proyecto/icono y ramas loading/free/expired; los callbacks conservan `/precios`.
  Se atrapan accesos a navegador/red y no se navega al renderizar.
- Lint completo bajo guard offline: **PASS, 0 errores + 10 warnings**, exit 0.
  No se agregó `--quiet`, `continue-on-error`, excepción ni reducción de reglas.
- Build offline: **PASS**; las advertencias existentes de Browserslist y tamaño
  del chunk principal siguen visibles. El build usa configuración sintética y
  no carga archivos de entorno.

El gate CI incluye el nuevo archivo de tests con la configuración existente;
mantiene guard JS y `unshare --net`. Windows local usa el guard JS, no un sandbox
de red del sistema operativo. Esbuild, Babel parser, React y ESLint ya pertenecen
al lockfile; no se agregó un transformador ni runtime nuevo.

## Los diez warnings siguen abiertos

Nueve `react-hooks/exhaustive-deps`: `ManualQuoterPath`, `Testimonials`,
`ChatWidget`, `ProveedorProductos`, `RenderWizardStep2`, `SupplierContext`,
`ImageUploadPage`, `PresupuestoPage` y `QuoterPage`. El décimo es una supresión
innecesaria en `SupplierContext`. Todos conservan los diagnósticos del baseline.
Requieren revisión individual de dependencias y ciclo de vida; no agregar
dependencias a ciegas, especialmente cuando un effect dispara solicitudes.

Pasar lint no cierra P0 de seguridad ni prueba autenticación, créditos reales,
pagos, cotización, efectos de navegador, accesibilidad interactiva ni calidad
visual. No hubo servidor dev, browser E2E, servicios reales, DB o deploy.
Los tests SSR sustituyen dependencias y no verifican render/animación del navegador.

## Revisión y reversibilidad

La entrega se prepara en un PR borrador; no se ejecuta merge ni deploy. El diff es reversible
sin migraciones ni pérdida de datos; un revert restauraría los nueve diagnósticos
y la fragilidad del helper, por lo que debe ser revisado. Dashboard, Budget Engine
V2 y Studio permanecen intactos. La web sigue siendo el frontend comercial.
