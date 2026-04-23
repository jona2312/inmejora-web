# Configuración del Formulario de Presupuesto Público

Este documento describe la arquitectura e implementación del formulario público de solicitud de presupuestos (`/presupuesto`).

## 1. Esquema de Base de Datos (Supabase)

Se creó la tabla `presupuestos_publicos` para separar estas solicitudes no autenticadas de las operativas internas.