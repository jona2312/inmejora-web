# P0 comercial — candidato de Web, 14/10/2026

Base exacta Web #24: `4d3b451de3b2240e3e7582e57d498247e88c09f3`.
Rama: `codex/commercial-p0-web-20261014`. Producción sin modificar.

## Cambio terminado

La promesa pública pasa a revisión inicial humana en un plazo objetivo de 24–72 horas hábiles desde información suficiente (o relevamiento completo cuando sea necesario). No promete presupuesto automático. El mensaje preparado conserva servicio/localidad y agrega origen web. Ese texto es editable por el visitante: es origen declarado, no identidad autenticada ni authority.

Preparar o abrir WhatsApp no crea un lead confirmado. Sólo un mensaje realmente recibido y autenticado por el backend puede iniciar ese procesamiento. No se agregaron llamadas de escritura, cálculos, precios, números productivos ni permisos.

La configuración existente sigue fallando cerrada cuando falta el WhatsApp explícito en producción. El número canónico debe acreditarse contra la instancia autorizada antes del release; no basta copiar un número de documentación.

## Verificación local

- `npm run test:ci`: 87/87.
- `npm run lint`: 0 errores; 8 warnings heredados.
- `npm run build:ci`: PASS con configuración sintética.
- `SHOTS=1 node node_modules/@playwright/test/cli.js test tests/browser/sales.spec.mjs --project=390px --project=1440px`: 58/58, Chromium real, navegación externa interceptada, cero mensajes reales.
- Evidencia: `evidence/browser.json`, `evidence/home-390.png`, `evidence/contacto-preparada-390.png` y variantes 1440px.
- Prueba cruzada en la rama Dashboard `codex/commercial-p0-integration-20261014`: usa este formatter real, Core HTTP y PostgreSQL sintético. Contacto delegado previamente; no demuestra alta de clientes nuevos, n8n activo, modelo real ni alerta móvil.

No se ejecutó una prueba desde teléfono físico. Los screenshots son de viewport móvil.

## Release bloqueado

Faltan SHA/digest efectivos de producción, acreditación del canal, alta segura de contactos nuevos, asistente real, alerta móvil y prueba operativa autorizada. Este PR no autoriza despliegue, sender ni mensajes reales. La política de horas hábiles requiere calendario/horario acordado antes de automatizar vencimientos; no modifica el SLA técnico de Budget.

Rollback propuesto, no ejecutado: descartar esta rama antes de publicar; si en el futuro se autoriza un despliegue, restaurar el artefacto anterior previamente identificado y su configuración aprobada. No tocar bases ni reactivar pricing legacy.
