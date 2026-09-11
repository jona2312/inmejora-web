# Issue #12 — identidad Web: contención explícita

Base: PR #17, `565bc8c71c558a47cf4da4767965457b191687c0`.
Rama: `codex/p0-web-identity`. Fecha: 2026-09-11.
Alcance: exclusivamente Web y #12. No se inició #13–#16, no se modificó Dashboard,
Studio, infraestructura, producción, secretos, pagos, renders, catálogo ni motores de presupuesto.
La modificación de transportes y de la lectura de credencial en `useCurrentPlan` es de identidad;
no cambia lógica de planes/pagos/catálogo. El catálogo público conserva sus dos GET existentes sin bearer.

## Dictamen

**CONTENIDO, no autenticación implementada.** Cliente y proveedor activo niegan identidad y operaciones de cuenta
para todos los usuarios, incluso usuarios legítimos anteriores. No se habilita un flujo alternativo.
El cierre de sesiones/ownership efectivos permanece **REQUIERE BACKEND / BLOCKED**.
La issue no debe cerrarse como autenticación productiva ni como certificación RLS.

### CORREGIDO

- No se guarda `user.id` como token ni se restaura autoridad desde `inmejora_user`, `inmejora_token`,
  `supplier_data` o `supplier_token` en los dos contextos.
- Los transportes de identidad modificados no leen ni adjuntan esos valores como bearer; los transportes privados niegan antes de red.
- No hay éxito simulado en `forgotPassword`, `resetPassword`, `updateProfile` ni alta del proveedor.
- Los proveedores ya no pueden recuperar una identidad anterior después de logout/cambio de cuenta:
  se eliminó el canal de restauración, no se agregó una validación optimista.
- El guard admin de #17 se conserva exactamente. `app_metadata.role` sólo decide presentación.

### CONTENIDO

- `InmejoraAuthContext` conserva los exports de su fachada y expone un estado congelado:
  `user=null`, `isAuthenticated=false`, `isLoading=false`. Login, registro, checkAuth, recuperación,
  reset y edición de perfil devuelven `success=false`, `ok=false`, `CLIENT_AUTH_BLOCKED`.
- `SupplierContext` activo queda separado de `ProveedorAuthContext` legado (sin cambios):
  `supplier=null`, `isLoggedIn=false`, `isLoading=false`; operaciones devuelven `SUPPLIER_AUTH_BLOCKED`.
- `ProtectedRoute` y `SupplierProtectedRoute` mantienen sus redirecciones/loading y no reciben una sesión autorizada del nuevo contexto.
  No se montan sus hijos privados. Un guard de React sigue sin constituir autorización backend.
- `supplierApiCall` rechaza también llamadas directas a login/productos; no lee endpoints, credenciales ni payload para aceptarlos.
  `getSupplierToken` devuelve null, `isSupplierLoggedIn` false y `setSupplierToken` no persiste ni valida tokens.
- `lib/apiCall`, `utils/apiClient`, `useApi` y `apiCallFormData` niegan operaciones legacy sin enviar requests.
  `lib/apiClient.apiCall` conserva exclusivamente los GET relativos ya existentes a catálogo colores/productos,
  sin Authorization; resto denegado. No se envían requests anónimos a operaciones privadas como fallback.
- `useCurrentPlan` obtiene null del accessor de credencial bloqueado y vacía la selección local antes de salir;
  no promueve un ID de storage a bearer. No se habilita un plan ni se modifica checkout.
- Login/registro cliente y login proveedor muestran el aviso antes del envío y deshabilitan submit.
  Invocar sus handlers directamente también termina en denegación, sin éxito, timer, navegación ni compra.
- Las páginas de recuperación/reset y ambas implementaciones de alta proveedor muestran indisponibilidad.
  No tienen formulario, timers de éxito, intercambio de código, OTP ni updateUser. La página de alta alternativa
  no está montada, pero también queda contenida para no reintroducir el falso éxito al reutilizarla.

### REQUIERE BACKEND / BLOCKED

| Contrato faltante en Web | Evidencia del consumidor anterior | Dependencia concreta para reabrir |
|---|---|---|
| Sesión cliente compatible | `InmejoraAuthContext` POST a Edge `auth-login`/`auth-register`, apikey pública; respuesta.user se convertía en credencial con String(user.id). Rama alternativa aceptaba token sin contrato de validación. | Fuente versionada/esquema real, emisor y audiencia, mapeo de usuario, expiración/validación/revocación y autorización por recurso. No basta que un string parezca JWT. |
| Sesión proveedor activo | POST `/supplier-login` esperaba token/provider; GET esperaba provider. Un HTTP 200 sin provider conservaba estado; registro retornaba éxito aun sin datos válidos. | Implementación/esquema real de sesión y estado vigente approved/active, validación de expiración/revocación/owner en `/supplier-products` y operaciones protegidas. No elegir nombres de campos por suposición. |
| Logout efectivo | Antes sólo eliminaba claves del navegador; no hay contrato revoke/logout de esos flows. | Verificar que tokens emitidos dejan de autorizar según la política de revocación definida. Borrar storage no revoca un bearer robado. |
| Recuperación de la misma identidad | Contexto cliente devolvía éxito mock, pero las páginas usaban Supabase Auth SDK; login cliente seguía usando Edge propio e ID como token. | Acordar identidad canónica, recuperación y su relación con login; código/OTP/session no se consideran intercambiables automáticamente. |
| Ownership | Filtros client_id, product.id, IDs de URL, URLs de archivos y metadata se originan en navegador. | Reglas reales backend/RLS/storage y pruebas negativas de otro usuario/proveedor, antes de habilitar. |

Método: búsqueda de archivos versionados de auth/session/supplier/supabase/contratos, lectura de ambos contextos,
transportes, guards y consumidores. Web contiene SDK/consumidores/documentación, pero no las implementaciones de
esas Edge Functions ni un contrato verificable compatible. `docs/p0/PROVIDER-AUTH-CONTAINMENT.md` ya registra el
desajuste con otro backend; no se lo trató como una migración autorizada. No se consultó producción ni se leyó otro repo en esta ejecución.

## Logout, expiración, revocación y respuestas antiguas

Logout limpia sólo las dos claves históricas del flujo correspondiente. Devuelve `scope: browser-only`,
`cacheCleared` y `serverRevocationVerified:false`; no declara cierre remoto ni éxito de autenticación.
Si storage lanza una excepción, la identidad igualmente permanece denegada. No se toca storage ajeno ni se borra
automáticamente información local al montar la app. Perfiles/tokens residuales se ignoran.

No existe sesión autorizada que pueda sobrevivir una expiración en estos contextos. No se hacen solicitudes de sesión,
por lo que un timeout/200 inválido/401/403/revocación no puede dejar un estado anterior en memoria.
Los valores están congelados y no hay setters, efectos, listeners, callbacks de red ni timers capaces de aceptar una respuesta tardía.

Las pruebas de carreras fuerzan que el consumidor de una operación anterior complete después de logout y una nueva
operación de otra cuenta. Ambas respuestas siguen siendo denegadas, así como validaciones y operaciones concurrentes.
Los fixtures de transporte (incluido uno que nunca termina) verifican **denegación antes de dispatch**, no validación
de un backend habilitado. No se fabricó una state machine de sesión para un contrato inexistente.

Límite operativo: una pestaña que todavía ejecuta el bundle viejo conserva ese código y sus requests previos;
esta rama no puede parchear ni revocar sesiones de una instancia ya abierta. Un futuro rollout autorizado requiere
revisión de pestañas/versiones y revocación servidor. No se hizo rollout ni refresh remoto de usuarios.

## Matriz de identidad y ownership

[identity-ownership.json](identity-ownership.json) enumera **todas las rutas de App.jsx**, sus entradas de identidad,
fuentes y las categorías UI_ONLY / BACKEND_REQUIRED / OWNERSHIP_UNPROVEN / CONTAINED. Incluye dependencias globales
y módulos sin ruta o de uso indirecto. Una prueba compara el conjunto documentado contra el AST real de App y verifica
que las rutas del portal mantienen su guard.

Resumen para revisión:

| Superficie | Clasificación principal | Estado |
|---|---|---|
| Login/registro/recuperación cliente | CONTENIDO + REQUIERE BACKEND | No identidad, credencial ni operación de cuenta. |
| Login/alta/portal proveedor activo | CONTENIDO + REQUIERE BACKEND | No identidad; transporte también denegado. |
| `/portal` y todos sus hijos | CONTENIDO + OWNERSHIP NO DEMOSTRADO | Denegación de montaje. Módulos de renders/pagos/Budget Engine no modificados. |
| Admin | UI ÚNICAMENTE + REQUIERE BACKEND | #17 intacto; ninguna afirmación sobre permisos efectivos. |
| Cotizador público, formularios/chat y carga de presupuesto | UI + REQUIERE BACKEND + OWNERSHIP NO DEMOSTRADO | Fuera de cambios funcionales; IDs/flags locales no son credenciales. |
| Servicios/catálogo | REQUIERE BACKEND para datos públicos | Lecturas existentes; políticas públicas no certificadas. |
| Tema/cookies/reload y páginas estáticas | UI ÚNICAMENTE | Sin autoridad de cuenta. |
| Tokens crudos en componentes de render sin consumidor localizado | REQUIERE BACKEND / NO VERIFICADO | No se modifican por alcance; no reutilizar como módulos de auth segura. |

### NO VERIFICADO

- `SupabaseAuthContext` independiente sigue usando getSession/onAuthStateChange y no se sustituye ni se asume compatible
  con cliente/proveedor. La app global y SDK pueden gestionar su propia sesión; no se afirma cero red en toda la app.
  Los consumidores públicos de Supabase, incluido cotizador, permanecen con ownership no demostrado.
- RLS, grants, visibilidad real de buckets, firma/revocación de tokens, ownership de APIs y capacidades desplegadas.
- La denegación del portal no convierte `rendersAPI`, `dashboardAPI`, uploads ni otros módulos directos en controles de autorización.
- No hay navegador/E2E, QA de layout ni servicios reales en esta tranche; SSR/handlers/VM son pruebas aisladas de la contención de #12.
- No se certifican mocks de negocio, créditos, renders ni estados de pagos. No se inició #13.

## Evidencia reproducible

Node 20.20.2 / npm 10.8.2. Instalación limpia:
`npm ci --offline --ignore-scripts --no-audit --no-fund`, 716 paquetes, cache preexistente requerido.
Sin cambio de dependencias ni lockfile.

- Suite existente de #17: 50/50 repetida tras la primera contención.
- Suite completa con 20 pruebas de identidad nuevas: **70/70**, sin fallos.
- Lint: **0 errores / 8 warnings**. Los 2 warnings retirados eran el efecto de SupplierContext y su supresión innecesaria;
  desaparecen con el código contenido. No se bajaron reglas, umbrales ni se ocultaron warnings.
- `build:ci`: **PASS, 3152 módulos**; detalles en [identity-verification.json](identity-verification.json). Warnings de bundle/Browserslist permanecen visibles.
- CI conserva `unshare --net` para tests/build/lint y el guard Node local. Instalación registry en CI no se denomina offline;
  la comprobación frozen local sí usa cache offline. No hay tests contra cuentas/datos reales.

| Requisito #12 | Prueba/evidencia |
|---|---|
| Loading / anónimo | SSR de ambos guards; hijo privado no se monta, loading no redirige y anónimo usa replace. |
| Sesión inválida/expirada/revocada | Fixtures de cache; getters no llamados; identidad siempre null. Transporte proveedor rechaza antes de red. |
| Cambio de cuenta / logout / completación tardía | Operación A retenida hasta después de logout/B; todas las operaciones retornan denegación; cache propia limpiada, sin revocación remota afirmada. |
| 200 sin provider / malformed / 401/403 / timeout | Fixtures detrás del transporte bloqueado; ni siquiera se despachan. No se afirma validación habilitada de respuestas del servidor. |
| Metadata local / credencial inexistente | Perfiles admin/approved y JWT-shaped strings ignorados; getters 0; state congelado; bearer proporcionado por caller tampoco alcanza adapter privado. |
| Recuperación sin falso éxito | Métodos false; páginas SSR sin formulario/éxito; handlers reales de login/registro sin timers/navigation/checkout. |
| Guards admin y scope | Diff respecto de #17 sin cambio en guard admin; suites anteriores intactas. Matriz de rutas contra AST. |

## Revisión y reactivación

Un único draft apilado sobre #17. No usar `Fixes #12` como cierre automático del backend pendiente.
No reactivar mediante env/browser flag ni restaurar el código anterior como rollback seguro.
Reapertura requiere contrato real revisado, implementación de validación/expiración/revocación/stale responses con fixtures
del contrato y evidencia de ownership en un entorno autorizado. Eso es trabajo futuro sujeto a revisión de Jona/Arkos.
Esta ejecución termina con commit, push, draft y CI; no merge, deploy ni siguiente issue.
