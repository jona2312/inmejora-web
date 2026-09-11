# INMEJORA Web — arquitectura comercial propuesta

Estado: DRAFT para Jona/Arkos. No implementa nuevas rutas ni habilita servicios.

## Función y fronteras

`Tráfico → Web → lead/proyecto → cotización preliminar / visita / diseño → operación`.

Web explica oferta, recoge intención y conserva continuidad. Studio es producto independiente:
`Web → API versionada autorizada → Studio`. Ningún import de código Studio, modelo BIM ni motor duplicado.
Budget Engine V2 será autoridad de costos sólo al existir contrato seguro; no se implementa dentro de Web.

## Evidencia de la oferta actual

La Home monta `Soluciones` con `src/data/SolucionesData.js`: reformas integrales, mantenimiento/reparaciones,
diseño interior, exteriores/paisajismo, visualización a partir de fotos y proyecto/presupuesto.
`/servicios` obtiene `servicios_precios` de Supabase y queda sin catálogo ante error; mezcla oferta editorial con datos de tarifas.
`Servicios.jsx` contiene otro catálogo estático, pero no es el catálogo montado de Home. Evitar perpetuar fuentes duplicadas.

| Entrada inicial | Respaldo del código | Tratamiento comercial propuesto |
|---|---|---|
| Construir | Albañilería, demoliciones, construcción en seco | Captar alcance. No anunciar obra nueva integral/llave en mano hasta validar capacidad y responsables. |
| Remodelar | Reformas integrales y ambientes | Ruta editorial principal, con alcance/exclusiones y casos acreditados. |
| Pintar | Pintura, revestimientos, materiales y paletas | Separar superficie, estado y preparación; derivar a visita cuando no haya diagnóstico. |
| Impermeabilizar | Reparación de humedades | Captar problema y fotos opcionales. Validar cubierta/muro/terraza, diagnóstico y oferta antes de publicar página específica. |
| Diseñar / visualizar | Diseño de interiores y renders desde fotos | Distinguir proyecto de diseño de propuesta conceptual con IA. Sin promesa de precisión BIM. |
| Presupuestar | Relevamiento, alcance y cotización personalizada | Intención transversal; solicitar revisión humana si faltan precios, medición o alcance. |

Exteriores/mantenimiento conservan acceso desde Servicios por estar sustentados. Gas, electricidad u otras instalaciones ya mencionadas requieren validación de alcance/profesionales; no ampliar promesas por ver una etiqueta en código.

Home actual sí tiene soluciones, proyectos, proceso, visualización, registro y CTA; carece de una entrada única por intención.
Los CTA de WhatsApp se repiten; `ServiceModal` recoge preguntas como texto para WhatsApp, sin lead persistido.
`useLeadRegistration` guarda nombre/email/teléfono/session_id mediante `/api/chat/register`, pero pierde alcance de proyecto,
abre WhatsApp y usa un redirect temporizado que puede interrumpir al visitante. El contrato nuevo no se supone aceptado por ese endpoint.

Confianza pendiente: `projectsData` y `proyectosData` usan imágenes Unsplash y describen obras/medidas/plazos;
`TransformacionesRealesData` incluso usa la misma foto de baño con cambio de saturación como antes/después.
No hay prueba de que sean trabajos ejecutados. Rotular como referencias conceptuales o reemplazar con casos autorizados,
sin atribuirlos a INMEJORA. Mantener ocultos los testimonios y marcas no verificados.

## Home propuesta (orden de lectura)

1. H1 breve: “Contanos qué querés mejorar en tu espacio”. Bajada con oferta y zona aprobadas; CTA principal “Empezar mi proyecto”.
2. Selector visible “¿Qué querés hacer?” con las seis intenciones; selección precompleta el primer paso. No requiere cuenta.
3. Problemas concretos: renovar ambiente, resolver humedad, cambiar terminaciones, visualizar antes de decidir.
4. Servicios editoriales con alcance y CTA contextual. Funcionan aunque el catálogo de precios no responda.
5. Dos o tres casos acreditados con problema, intervención y resultado; referencias visuales claramente etiquetadas si faltan casos.
6. Proceso: contás el proyecto → revisamos alcance → coordinamos propuesta/visita. Sin garantizar plazos no confirmados.
7. Confianza: equipo verificable, zona, modalidad de trabajo, privacidad y contacto manual.
8. CTA final al mismo funnel; WhatsApp secundario con contexto y disponibilidad real del asistente.

Móvil: sin video pesado obligatorio para comprender la propuesta; primer bloque ligero, botones de al menos 44 px,
una columna a 360 px, foco visible, labels, errores junto al campo, progreso y volver sin perder datos.
Evitar superposición del CTA, chat, cookies y teclado. Respetar movimiento reducido.
Aceptación: recorrido completo a 360/390/768/1440 px, teclado, zoom 200%, sin scroll horizontal ni pérdida al volver.
Son criterios futuros, no resultado de QA visual de esta ejecución.

## Mapa de rutas y migración

| Ruta | Estado actual → propuesta | Indexación / CTA |
|---|---|---|
| `/` | Home extensa → entrada por intención | Indexable; empezar proyecto. |
| `/servicios` | Consulta tarifas en vivo → catálogo editorial único | Indexable; enlaza subpáginas y funnel. |
| `/servicios/remodelaciones` | Nueva, basada en oferta existente | Publicar con contenido aprobado; CTA con intención. |
| `/servicios/pintura` | Nueva, basada en oferta existente | Superficies/preparación/exclusiones; CTA. |
| `/servicios/diseno-interior` | Nueva | Entregables y alcance humano/conceptual; CTA diseño. |
| `/servicios/visualizacion` | Nueva | Foto → propuesta conceptual; no render BIM ni resultado garantizado. |
| `/servicios/mantenimiento`, `/servicios/exteriores` | Nuevas, ya representadas en Soluciones | Editorial validado; no duplicar textos. |
| `/servicios/construccion`, `/servicios/impermeabilizacion` | Reservadas, requieren decisión de oferta | No sitemap ni publicación hasta respaldo. Intención de consulta disponible en prototipo. |
| `/proyectos` | Galería → casos autorizados / referencias identificadas | Indexable; filtro simple sin indexar combinaciones. |
| `/proyectos/:slug` | Nueva, sólo con caso verificable | Problema, alcance, imágenes autorizadas, CTA similar. |
| `/empezar` | Nueva, funnel progresivo | Noindex para pasos/queries; no publicar datos de lead en URL. |
| `/cotizador` | Cotizador actual → orientación preliminar | Copy honesto; rango sólo con datos versionados válidos, si no solicitud manual. |
| `/presupuesto` | Captura actual → entrada al mismo funnel con intención cotización | Evitar formularios duplicados; redirect sólo tras revisar enlaces/analytics. |
| `/contacto`, `/nosotros` | Existentes | Contacto real y equipo acreditado; enlazar servicios. |
| `/asistente-ia` | Existente, atención manual anunciada | Explicar estado real; continuidad del lead. No fingir asistente activo. |
| `/catalogo`, `/catalogo/colores`, `/catalogo/productos` | Existentes | Soporte a elección; no prometer stock/precio sin dato vigente. |
| `/planes`, `/precios` | Existentes con compras contenidas | Revisar promesas; no reactivar cobros; no presentar plan como adquirido. |
| `/login`, `/registro`, `/forgot-password`, `/reset-password` | Existentes | Noindex; pendientes contratos de identidad y falsos éxitos. |
| `/portal` y rutas actuales | Cliente con varias fuentes de auth → futuro portal coherente | Noindex; sesiones y ownership de servidor, no localStorage como autoridad. |
| `/portal/proyectos`, `/portal/proyectos/:id` | Futuras, no montadas | Fotos, renders, propuestas, aprobaciones, visitas, documentos y estado por proyecto. |
| `/portal/pagos`, `/portal/planes` | Existentes | Lectura verificada futura, sin checkout nuevo. |
| `/proveedores`, `/proveedores/registro`, `/proveedores/login`, `/proveedores/portal` | Existentes, B2B separado | Landing editorial indexable; identidad/portal noindex y P0 previo. |
| `/admin/proveedores`, `/admin-inmejora` | Existentes con mocks | Noindex y permisos efectivos antes de operaciones reales. |
| `/checkout/success`, `/checkout/error`, `/checkout/pending` | Aviso no verificado de #10 | Noindex, no inferir pago desde path/query. |
| `/politica-de-privacidad`, `/terminos-y-condiciones`, `*` | Existentes | Revisar contenido; 404 real en estrategia de hosting futura, no cambiar infraestructura ahora. |

Portal existente también monta perfil, renders y edición, cotizaciones, dashboard, analizar, budgets y upload.
Mantener enlaces compatibles durante migración; no duplicar esas funciones con componentes nuevos sin definir el dominio común.

## Funnel progresivo

| Paso | Campos | Regla / salida |
|---|---|---|
| 1. Qué querés hacer | Una de seis categorías | Estado inicial desde CTA validado; puede cambiarse. |
| 2. Dónde y qué espacio | Localidad/zona, tipo de inmueble/ambiente | No dirección exacta todavía. Zona no cubierta → consulta sin prometer visita. |
| 3. Contanos el trabajo | Descripción breve, medidas aproximadas con unidad o “no sé” | Pintura: superficie/estado; humedad: dónde ocurre; diseño: objetivo/estilo; construcción: alcance. Máximo 2–3 preguntas visibles por subpaso. |
| 4. Referencias opcionales | Fotos, preferencias/materiales | Saltable; medidas se marcan aproximadas. No requieren carga para dejar consulta. |
| 5. Cómo seguimos | Consulta / cotización / visita / diseño; nombre y un canal de contacto | Pedir email sólo si eligió email, teléfono sólo si eligió teléfono/WhatsApp. Consentimiento específico, marketing separado. |
| 6. Revisar y enviar | Resumen editable | Una sola creación idempotente; sólo confirmar recepción tras respuesta válida del servidor. |
| 7. Confirmación | Referencia de solicitud y próxima acción | Abrir WhatsApp por clic explícito con resumen corto + referencia; conservar registro fuera de WhatsApp. |

Estados: `editing → reviewing → submitting → received` o `submission_failed`; fotos tienen estado propio.
Volver/editar conserva campos; cambiar categoría descarta sólo campos incompatibles tras indicarlo.
Doble clic/reintento usa la misma clave idempotente. Si timeout deja resultado desconocido, consultar/reintentar el mismo intento,
no crear otro lead. No afirmar “recibido” al guardar localmente ni al abrir WhatsApp.

Si backend falla: preservar en memoria, mostrar reintentar y ofrecer copiar resumen/contacto manual como alternativa explícita;
avisar que la solicitud no quedó confirmada. No guardar fotos/contacto en localStorage por defecto. Borrador persistente futuro requiere consentimiento y caducidad.
Referencia pública de lead nunca es credencial de acceso. No poner email, dirección, fotos ni tokens en query, analytics o logs.

## Contrato propuesto de lead v1 — NO existente

El [ejemplo sintético](lead-v1.example.json) ilustra un DTO para acordar con backend, no se envía a `/api/chat/register`.
Endpoint candidato: `POST /api/v1/leads`, sujeto a aprobación del dueño del contrato.
Entrada: `schema_version`, `idempotency_key`, `source`, `project` (categoría, ubicación general, ambiente, medidas y descripción),
`preferences`, `attachment_refs`, `intent`, `contact`, `consent`.
`source` registra ruta y campaña saneada; no transmite URL completa. Sesión de chat correlaciona, no autentica.

Validación propuesta: enums cerrados, longitudes (descripción <=2000; nombre <=100), medidas finitas positivas con unidad m/m2 y máximo razonable por campo;
“no sé” es null, nunca cero inventado. Backend revalida todos los campos y rechaza claves inesperadas/roles/costos impuestos por cliente.
Contacto según canal, consentimiento versionado. No usar valores del DTO para roles, créditos, ownership ni presupuesto.

Fotos futuras: hasta 5 de 10 MB, JPEG/PNG/WebP; validación real de tipo y tamaño en servidor, EXIF eliminado,
almacenamiento privado, acceso firmado limitado, expiración de archivos huérfanos. `attachment_refs` sólo admite recursos autorizados del intento;
sin URLs externas arbitrarias/base64 en el lead. Política de retención/borrado requiere acuerdo antes de habilitar uploads.

Respuesta propuesta: `lead_id`, `reference`, `status: received`, `received_at`, `next_action` de un enum y token opaco de continuación si procede.
No aceptar redirección/URL libre del backend. Errores 400/422 para campos, 429 para abuso, 5xx reintentable y conflicto idempotente explícito.
Servidor aplica protección antiabuso y deduplicación sin usar datos personales como clave pública.
Persistencia y relación lead→proyecto son del backend. Web retiene referencia y estado mínimo; un adaptador posterior mapeará el contrato aprobado.

WhatsApp/asistente: antes de derivar, registrar contexto; mensaje breve con referencia y alcance, sin fotos/datos sensibles incluidos por defecto.
Botón manual debe funcionar aunque el navegador bloquee ventanas emergentes; no redirigir automáticamente a los tres segundos.
El asistente futuro recibe contexto por API autorizada usando lead/proyecto, no leyendo transcripciones del frontend como autoridad.

## Cotización y renders

- Web: orientación/rango preliminar, con fecha de precios, zona, alcance, supuestos y límites. Si falta vigencia o medición: “Necesitamos revisar tu proyecto”; no monto 0 ni precio formal.
- `CalculationEngine.js` aplica hoy 35% de buffer, 21% IVA y coeficientes locales; no se extiende ni se certifica como Budget Engine. Inventariar consumidores antes de reemplazar. `QuoterPage` consulta tarifas pero el copy promete mercado real sin acreditarlo.
- Cotización formal: revisión humana o Budget Engine V2 por contrato seguro futuro; versionado y aprobación de alcance. No se habilita automáticamente.
- Render comercial: foto → propuesta conceptual, sin exactitud dimensional/estructural ni promesa de construcción fiel. Mostrar imagen origen y disclaimer concreto.
- Render Studio: geometría BIM real → Blender/Bonsai → render de proyecto. Acceso futuro explícito vía API, nunca tratar una imagen conceptual como BIM.
- Generar/descargar/renderizar no puede mostrar éxito de los mocks actuales como entrega real.

## Portal futuro y contrato Studio

Proyecto como agregador de brief, fotos, referencias visuales, versiones de presupuesto, decisiones, visitas,
documentos y eventos de estado. Cada recurso requiere identidad y ownership efectivos del servidor;
no deducirlos de IDs de URL ni metadata editable. Estado recibido/en revisión/pendiente de datos/propuesta enviada
debe provenir de backend, no de una navegación.

Aprobaciones guardan versión aceptada, actor y fecha; visitas distinguen solicitada de confirmada.
Studio será un `external_project_ref` obtenido del servidor con permiso del usuario; intercambio mínimo versionado,
errores/reintentos/expiración y auditoría. No acoplar sesiones, tablas ni repositorios hoy.

## Backlog verificable (posterior a P0)

| ID / prioridad | Trabajo | Aceptación y dependencia |
|---|---|---|
| COM-1 / P1 | Catálogo editorial único y verdad de oferta | Cada servicio tiene evidencia, alcance/exclusiones, responsable, zona y CTA; no depende de tabla de precios para explicar oferta. Decisión de Construir/Impermeabilizar. |
| COM-2 / P1 | Casos y confianza | Consentimiento/procedencia por imagen; stock rotulado; sin métricas/testimonios/SLA sin respaldo. Revisar promesas de renders y planes. |
| LEAD-1 / P1 | Contrato y adaptador de leads | Revisión backend, fixture recibido/error/timeout/duplicado; no enviar campos nuevos al endpoint legado sin contrato. |
| LEAD-2 / P1 | Funnel y continuidad WhatsApp | Seis caminos, <=3 preguntas por subpaso, volver conserva datos, fotos saltables, contacto condicional; sólo confirmar tras persistencia. LEAD-1 y COM-1. |
| HOME-1 / P1 | Home comercial móvil | Orden descrito, CTA contextual, teclado/zoom/360–1440 px, sin overlays tapando campos. COM-1/2 y funnel. |
| QUOTE-1 / P1 | Orientación honesta | Sin precio/rango si vigencia/alcance no validado; sin presupuesto formal automático; separar Budget Engine y Studio. |
| SEO-1 / P1 | URLs, canonical, metadata e indexación | Un mapa único de rutas indexables; title/description/canonical únicos; dominio aprobado, noindex en cuenta/admin/retornos; probar HTML renderizado. |
| SEO-2 / P1 | Sitemap y robots | Sólo URLs publicadas canónicas indexables; incluir /nosotros si aprobado; excluir privadas/checkout/queries. Hoy `/portal/` no cubre `/portal` y `/admin/` no cubre `/admin-inmejora`; robots no reemplaza auth ni noindex. |
| SEO-3 / P2 | schema.org | Organization/LocalBusiness sólo con datos reales y cobertura aprobada; Service y BreadcrumbList coherentes con contenido visible; validar JSON-LD sin reseñas/ratings inventados. |
| SEO-4 / P2 | Servicios e internos | Cada página resuelve una intención distinta, enlaza casos y funnel; detectar enlaces rotos/huérfanos; migración sin duplicar `/presupuesto`/`/cotizador`. |
| SEO-5 / P2 | Geográfico responsable | Crear página local sólo con cobertura/casos/contenido propio comprobado; ninguna generación masiva por localidad. |
| PERF-1 / P1 | Imágenes y Core Web Vitals | Medir primero móvil: LCP <=2.5s, INP <=200ms, CLS <=0.1 como objetivos de p75 de campo; laboratorio es proxy. Imagen hero dimensionada, srcset/formatos modernos, lazy bajo pliegue, sin lazy del LCP. |
| PERF-2 / P2 | Bundle y dependencias | Medir rutas/chunks, reducir carga inicial sin subir umbral para ocultar warning; evaluar video y providers globales. No certificar CWV con build. |
| PORTAL-1 / P2 | Dominio proyecto y estados | Fixtures de proyectos/fotos/presupuestos/visitas/documentos/aprobaciones; denegación entre usuarios; contrato antes de integración. |
| STUDIO-1 / futuro | Contrato API versionada | Documento separado con scopes/ownership/versionado; sin import de código ni implementación BIM Web. No iniciar en esta tranche. |

Medición de conversión propuesta: inicio de funnel, paso completado, validación fallida (tipo, no contenido), envío confirmado,
clic a WhatsApp y solicitud de visita. Denominadores por sesión consentida; no inferir conversión desde apertura de WhatsApp.
Analytics debe excluir PII y respetar decisión de consentimiento; no se instala tracker en esta tranche.
