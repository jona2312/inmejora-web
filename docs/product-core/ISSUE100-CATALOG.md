# Issue100 — precios desde CRM

Base Web #34 c9541d781f40a1a0719b1e52a10bdb6ad9988c22; Core padre #99 d3426d867a85149a08ad89115ad452d9a6d5c46d.

`/planes`, `/precios`, checkout de lectura y catálogo del portal comparten `CanonicalCatalog` y `GET /api/plans/dynamic` del Core versionado. El cliente valida estructura, versión aprobada, moneda/unidades menores y compras OFF. Ante error no hay precio de respaldo. Historial de suscripción del cliente continúa no acreditado; no confundir catálogo público con derecho adquirido.

Cambios de precio/periodo/créditos/beneficios/publicación se hacen en Dashboard; el siguiente fetch muestra la versión aprobada. No hay copia de precios en Web ni conversión. El panel usa diseño oscuro/dorado/verde. Drafts no aparecen. La antigua lista `pricingData` no es consumida por precios ni checkout. Hooks legacy de pago siguen rechazando cualquier efecto.

Laboratorio: `tests/project-core/catalog-browser.ts` en Core inicia PostgreSQL sintético + Dashboard + este checkout Web, cambia precio/aprueba v2 y acredita rutas por Chromium con egress bloqueado. No se usa auth productiva ni cuenta real. El portal conserva su barrera de identidad, no se sortea para mostrar una demo.

Publicación real bloqueada por integración de origen HTTPS, auth de portal, metadata de esquema efectivo, aprobación comercial, cuentas MP/Stripe y gates de release. No Vercel ni infraestructura nueva. C2_LIVE_PREFLIGHT=HOLD.
