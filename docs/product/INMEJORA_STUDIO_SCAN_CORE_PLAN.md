# INMEJORA Studio + Scan Core — Plan maestro de producto y producción

> Documento operativo para convertir INMEJORA Studio en un producto ejecutable, medible y vendible, sin bloquear el MVP por la complejidad de escaneo espacial avanzado.

## 1. Decisión de producto

El producto se construirá en tres capas consecutivas:

1. **INMEJORA Studio Web / Dashboard**
   - Primer producto comercial.
   - Vive dentro del portal web actual.
   - Organiza proyectos, fotos, medidas manuales, materiales, renders, costos y cotizaciones.
   - Reutiliza el backend Horizon, el sistema de créditos y `render_jobs`.

2. **App IN Estudio**
   - Segunda etapa.
   - Aplicación iOS/Android para capturar fotos, cargar medidas, revisar propuestas, aprobar cambios, coordinar visitas y seguir la obra.
   - Consume la misma API y los mismos proyectos que la web y WhatsApp.

3. **Scan Core / ARCore / visión espacial**
   - Tercera etapa.
   - Captura avanzada de profundidad y geometría, inicialmente en Android.
   - Produce planos y modelos livianos con niveles de confianza y corrección manual.
   - BIM/IFC y DXF son exportaciones posteriores, no bloqueos del MVP.

INMEJORA Studio no busca reemplazar Revit, AutoCAD ni herramientas BIM profesionales. Busca ser una experiencia simple y didáctica para visualizar una reforma, ordenar la información del proyecto y convertirla en visita, propuesta, anticipo u obra.

## 2. Resultado esperado del MVP

Un cliente debe poder:

1. Crear un proyecto.
2. Elegir un tipo de ambiente y una intención de reforma.
3. Subir una o más fotos.
4. Cargar medidas básicas manuales.
5. Obtener superficies preliminares editables.
6. Seleccionar colores, materiales o un estilo.
7. Generar una propuesta visual conceptual usando créditos.
8. Obtener una cotización preliminar revisable.
9. Enviar el proyecto a revisión de INMEJORA.
10. Consultar desde el portal el estado, las correcciones y las aprobaciones.

El producto debe comunicar que las mediciones y cotizaciones automáticas son preliminares hasta que INMEJORA las valide.

## 3. Arquitectura existente que se reutiliza

La solución actual ya dispone de componentes relevantes distribuidos entre dos repositorios:

### `inmejora-web`

- React 18 y Vite.
- Portal del cliente y rutas protegidas.
- Formularios, catálogo, planes y checkout web.
- Supabase para determinadas funciones de autenticación, leads y archivos.
- Interfaces iniciales de renders y cotizaciones.

### `inmejora_dashboard_aprobacion`

- API Node.js/Express y tRPC.
- Endpoints Horizon de registro, login, portal, créditos, renders y cotización.
- MySQL/TiDB con Drizzle como base del dominio operativo.
- Tablas `client_subscriptions`, `client_credits` y `render_jobs`.
- Motor de imágenes, almacenamiento, Mercado Pago, Stripe, WhatsApp, Evolution API y n8n.
- Dashboard interno de presupuestos, aprobaciones y operación.

### Decisión de integración

- La web, la futura app y WhatsApp deben consumir una única API de producto.
- MySQL/TiDB será la fuente principal para usuarios operativos, proyectos, créditos, renders y cotizaciones.
- Supabase puede mantenerse para marketing, leads o almacenamiento donde ya aporte valor, pero no debe convertirse en una segunda fuente de verdad para créditos o renders.
- `render_jobs` será la fuente única de la galería de renders.
- `client_credits` se mantendrá como ledger de movimientos, con operaciones transaccionales e idempotentes.
- n8n automatizará comunicaciones y tareas periféricas; no será el propietario del estado crítico de un proyecto.

## 4. Trabajo previo obligatorio — Backend Mobile Ready

Antes de construir nuevas pantallas se debe cerrar la integración existente:

- Reemplazar los mocks de `src/utils/rendersAPI.js` por llamadas reales a Horizon.
- Unificar autenticación; el frontend no debe utilizar el ID del usuario como token Bearer.
- Hacer que la galería consulte `render_jobs`, no `client_credits`.
- Definir una API versionada, por ejemplo `/api/v1`.
- Unificar la generación web, WhatsApp y API v2 detrás de un servicio de dominio común.
- Crear trabajos asíncronos durables para renders.
- Reservar, confirmar y devolver créditos mediante una transacción atómica.
- Añadir claves de idempotencia para evitar trabajos y cobros duplicados.
- Eliminar secretos y claves por defecto del código.
- Sincronizar `package.json` con sus lockfiles y dejar CI reproducible.
- Documentar ambientes de desarrollo, staging y producción.

## 5. Capa 1 — INMEJORA Studio Web

### 5.1 Rutas propuestas

- `/studio`
  - Presentación interna del producto.
  - Proyectos recientes.
  - CTA “Crear proyecto”.

- `/studio/proyectos`
  - Lista y filtros.
  - Estados: borrador, esperando información, en revisión, propuesta, cotizado, aprobado, en obra, finalizado.

- `/studio/proyectos/:id`
  - Resumen del proyecto.
  - Ambientes, fotos, medidas y notas.
  - Materiales y colores.
  - Renders y versiones.
  - Cotización preliminar y propuesta revisada.
  - Timeline de eventos y aprobaciones.

- `/studio/proyectos/:id/editor`
  - Editor liviano de medidas y superficies.
  - El P0 puede comenzar con un plano 2D esquemático y medidas manuales.

### 5.2 Funciones P0

- Crear, editar y archivar un proyecto.
- Crear uno o más ambientes dentro del proyecto.
- Tipos iniciales: cocina, baño, living, dormitorio, patio, fachada, pintura y portón.
- Intenciones: pintar, remodelar, reparar, revestir, diseñar y presupuestar.
- Subir fotos JPG, PNG o WebP con compresión y metadatos.
- Cargar largo, ancho, alto y aberturas.
- Calcular piso, perímetro y paredes netas de forma preliminar.
- Guardar `room_layout_manual` versionado.
- Elegir materiales, colores y estilo visual.
- Generar un render conceptual asociado al proyecto y ambiente.
- Mostrar saldo de créditos e historial de generación.
- Crear una cotización preliminar con snapshot de precios.
- Solicitar revisión de INMEJORA.
- Compartir un resumen por WhatsApp y generar PDF.

### 5.3 Fuera de alcance del P0

- Modelado BIM profesional.
- Cómputo métrico certificado.
- Detección automática perfecta de geometría.
- Planos ejecutivos o municipales automáticos.
- Edición 3D equivalente a software CAD.
- Exportación IFC/DXF.

## 6. Modelo de datos inicial

El modelo se agrega al backend operativo, con claves externas hacia el usuario/suscripción existente.

### Tablas P0

- `studio_projects`
  - Propietario, nombre, dirección opcional, estado y origen.

- `studio_rooms`
  - Proyecto, tipo de ambiente, intención y versión de layout.

- `studio_project_assets`
  - Fotos, videos, PDFs y archivos generados.

- `studio_measurements`
  - Medida, unidad, método de captura, confianza y validación.

- `studio_material_selections`
  - Superficie, material/color, cantidad estimada y snapshot del catálogo.

- `studio_render_jobs`
  - Relación entre proyecto/ambiente y el `render_jobs` existente.

- `studio_quotes`
  - Versión, moneda, subtotal, margen, impuestos, rango, vigencia y estado de revisión.

- `studio_quote_items`
  - Materiales, mano de obra, servicios y cantidades.

- `studio_project_events`
  - Timeline auditable de cargas, cambios, revisiones y aprobaciones.

- `studio_approvals`
  - Decisión, usuario, versión aprobada, comentario y fecha.

### JSON manual inicial

```json
{
  "schema_version": "0.1",
  "source": "manual_web",
  "project_id": "proj_001",
  "room": {
    "type": "kitchen",
    "length_m": 4.8,
    "width_m": 3.1,
    "height_m": 2.6
  },
  "openings": [
    {
      "type": "window",
      "width_m": 1.2,
      "height_m": 1.0
    }
  ],
  "surfaces": {
    "floor_m2": 14.88,
    "wall_m2_gross": 41.08,
    "wall_m2_net": 39.88
  },
  "confidence": {
    "level": "manual_preliminary",
    "requires_validation": true
  }
}
```

## 7. API mínima de producto

La API debe permitir que web, app y adaptadores externos compartan contratos:

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/me`
- `GET /api/v1/credits`
- `POST /api/v1/studio/projects`
- `GET /api/v1/studio/projects`
- `GET /api/v1/studio/projects/:id`
- `PATCH /api/v1/studio/projects/:id`
- `POST /api/v1/studio/projects/:id/rooms`
- `POST /api/v1/studio/assets/upload-url`
- `POST /api/v1/studio/rooms/:id/measurements`
- `PUT /api/v1/studio/rooms/:id/layout`
- `POST /api/v1/render-jobs`
- `GET /api/v1/render-jobs/:id`
- `GET /api/v1/studio/projects/:id/renders`
- `POST /api/v1/studio/projects/:id/quotes`
- `GET /api/v1/studio/projects/:id/quotes`
- `POST /api/v1/studio/quotes/:id/request-review`
- `POST /api/v1/studio/approvals/:id/decision`

Los endpoints de generación deben responder `202 Accepted` con un `jobId`; la app consulta estado o recibe una notificación cuando el resultado está listo.

## 8. Capa 2 — App IN Estudio

### Objetivo

Sustituir el intercambio desordenado de fotos por WhatsApp por un proyecto estructurado, manteniendo WhatsApp como canal complementario.

### Stack propuesto

- React Native + Expo + TypeScript para iOS y Android.
- Cámara y galería nativas.
- Keychain/Keystore para tokens.
- Push notifications mediante APNs/FCM.
- Caché local y reintentos para conectividad irregular.
- La app sólo consume `/api/v1`; no accede directamente a la base ni a proveedores de IA.

### Funciones P0 móvil

- Login y recuperación de sesión.
- Proyectos compartidos con la web.
- Captura guiada de fotos.
- Carga de medidas manuales.
- Notas, audio y videos breves.
- Selección de materiales y estilo.
- Solicitud y seguimiento del render.
- Galería antes/después.
- Comentarios y aprobación/corrección.
- Estado de cotización y visita.
- Notificaciones de render listo o revisión solicitada.
- Saldo de créditos en modo lectura.

### Pagos móviles

El primer release será de consumo: los créditos se acreditan por compras realizadas en la web y confirmadas por webhook. La app no tendrá checkout, webview de pago ni CTA de compra hasta validar las reglas de App Store y Google Play para cada mercado.

## 9. Capa 3 — Scan Core / ARCore

### Objetivo

Convertir una captura guiada en geometría medible con trazabilidad y nivel de confianza.

### Arquitectura propuesta

- Android nativo: Kotlin, Jetpack Compose, CameraX y ARCore.
- Captura de frames, poses, profundidad y metadatos del dispositivo.
- Subida reanudable de una sesión de escaneo.
- Worker Python con Open3D y OpenCV.
- Reconstrucción y simplificación de nube de puntos.
- Detección de paredes, piso, techo y aberturas.
- Corrección manual obligatoria antes de usar medidas críticas.
- Plano 2D y modelo GLB/GLTF.
- Exportación IFC mediante IfcOpenShell en una fase posterior.

### Artefactos de salida

- `scan_session_manifest.json`
- `room_layout.json`
- `confidence_report.json`
- `floor_plan.svg` o PDF
- `room_model.glb`
- IFC y DXF cuando el modelo geométrico esté validado

## 10. Roadmap

### Fase 0 — Preparación y estabilización

- Publicar este documento.
- Crear ADRs de autenticación, base principal, storage y cola de trabajos.
- Corregir la integración real de renders en la web.
- Unificar créditos y autenticación.
- Agregar CI reproducible.

### Fase 1 — Proyectos y fotos

- Ruta `/studio`.
- Lista y detalle de proyectos.
- Ambientes y activos.
- Carga directa mediante URL firmada.

### Fase 2 — Medidas y superficies

- Formulario de medidas.
- `room_layout_manual` versionado.
- Cálculos editables con advertencia de precisión.
- Primera vista 2D.

### Fase 3 — Materiales y renders

- Catálogo mínimo normalizado.
- Selecciones por superficie.
- Renders asociados a proyecto y ambiente.
- Cola durable, créditos idempotentes y galería real.

### Fase 4 — Cotización preliminar

- Motor de costos con snapshots.
- Rango de inversión y vigencia.
- Revisión interna, historial y aprobación.
- PDF/WhatsApp.

### Fase 5 — App IN Estudio

- App Expo iOS/Android.
- Captura, proyectos, renders, aprobaciones y visitas.

### Fase 6 — Scan Core

- Prueba de concepto ARCore.
- Dataset de ambientes reales.
- Worker geométrico y reporte de confianza.
- Piloto de campo antes de BIM/IFC.

## 11. Backlog priorizado

### P0 — Fundaciones

- [ ] Decidir identidad única y contrato de tokens.
- [ ] Definir API `/api/v1`.
- [ ] Corregir lockfiles y CI.
- [ ] Crear esquema de proyectos y migraciones.
- [ ] Crear ruta `/studio`.
- [ ] Crear proyecto y ambiente.
- [ ] Subir fotos con URL firmada.
- [ ] Cargar medidas manuales.
- [ ] Generar y editar `room_layout_manual`.
- [ ] Calcular superficies.
- [ ] Conectar renders reales al proyecto.
- [ ] Convertir créditos en una operación atómica e idempotente.
- [ ] Crear galería desde `render_jobs`.
- [ ] Crear cotización preliminar versionada.
- [ ] Solicitar revisión y registrar aprobación.
- [ ] Generar resumen PDF/WhatsApp.

### P1 — Experiencia comercial

- [ ] Plano 2D editable.
- [ ] Viewer 3D GLB/GLTF.
- [ ] Catálogo de materiales normalizado.
- [ ] Versiones antes/después.
- [ ] Timeline de proyecto.
- [ ] Comentarios y modo técnico.
- [ ] Push/email de estados.
- [ ] Registro de visita y anticipo.
- [ ] Auditoría de costos y márgenes.

### P2 — Mobile y escaneo

- [ ] App móvil IN Estudio.
- [ ] Captura guiada de fotos.
- [ ] Offline y subida reanudable.
- [ ] Prueba ARCore de profundidad.
- [ ] Dataset y métricas de precisión.
- [ ] Worker Open3D/OpenCV.
- [ ] Corrección manual de geometría.
- [ ] Exportación GLB, IFC y DXF.

## 12. Criterios de aceptación del MVP Studio Web

El MVP se considera listo cuando:

- Un usuario autenticado crea y recupera un proyecto.
- Cada proyecto admite ambientes, fotos y medidas.
- El sistema calcula superficies preliminares editables.
- Las entradas y resultados guardan versión y autor.
- Un render real queda asociado al ambiente y aparece en la galería.
- El crédito se descuenta una sola vez tras un resultado exitoso.
- Un error devuelve o libera el crédito automáticamente.
- Se genera una cotización preliminar con snapshot de precios.
- INMEJORA puede revisar y aprobar una versión.
- El cliente puede descargar o compartir el resumen.
- Ninguna pantalla presenta las medidas como certificadas.
- Existen logs y métricas de errores, tiempos y costo por render.

## 13. Métricas iniciales

- Porcentaje de proyectos que completan fotos y medidas.
- Tiempo hasta el primer render.
- Tasa de éxito y reintento del motor de imágenes.
- Costo medio por render exitoso.
- Conversión de render a solicitud de revisión.
- Conversión de revisión a visita, propuesta y anticipo.
- Diferencia entre cotización preliminar y final.
- Tasa de correcciones solicitadas.

## 14. Regla comercial y legal

Las mediciones del Studio Web y de la app móvil son estimaciones preliminares. Para presupuestos finales, fabricación, portones, muebles a medida, estructura, instalaciones o cualquier trabajo crítico, INMEJORA debe validar las medidas presencialmente o con instrumental adecuado.

Cada layout, cotización y exportación debe incluir:

- método de captura;
- fecha y versión;
- nivel de confianza;
- responsable de la última corrección;
- indicación de si requiere validación presencial.

## 15. Estimación de producción

Con dos desarrolladores dedicados, diseño parcial y QA:

- Backend Mobile Ready: 2–3 semanas.
- Studio Web P0: 5–7 semanas adicionales.
- App móvil beta: 5–7 semanas después de estabilizar la API.
- Scan Core POC: 8–12 semanas de investigación y prueba de campo.

La recomendación es validar comercialmente Studio Web antes de comprometer el desarrollo completo de Scan Core.

## 16. Próximas decisiones

1. Aprobar este plan y convertir P0 en issues.
2. Elegir la fuente única de identidad.
3. Confirmar MySQL/TiDB como base del dominio Studio.
4. Elegir una cola durable para renders.
5. Diseñar el primer flujo `/studio → proyecto → ambiente → render → cotización`.
6. Definir quién valida cotizaciones y medidas dentro del dashboard.
