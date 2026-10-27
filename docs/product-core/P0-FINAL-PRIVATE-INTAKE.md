# P0-C: presupuesto con fotografía privada

Base exacta: Web #33 `6bf639625396386d9c366fe1e116cc54eb5c29c2`.

`/presupuesto` reutiliza `ConsultaForm` cuando está habilitada la composición de laboratorio existente. Primero persiste el intake y obtiene su sesión/capability de proyecto; después utiliza el endpoint privado Core para hasta cuatro fotografías. No hay otro formulario canónico, bucket público, identidad por teléfono ni autoridad en localStorage.

El gate `localCoreEnabled` permanece intacto. Esta rama NO habilita una composición productiva: la habilitación HTTPS, admisión controlada y acreditación de infraestructura requieren su gate operativo. Fuera del laboratorio se conserva el pedido legacy sin fotografía, y se elimina la instrucción de depender de WhatsApp para completarlo. No se convierte un clic de WhatsApp en un lead.

Verificación local: 105/105 tests de `test:ci`; lint 0 errores/8 warnings heredados; `build:ci` PASS. Se agrega a CI la regresión de Storage público, que ya existía pero faltaba en la lista explícita del workflow. El recorrido Chromium con Core se ejecuta en el candidato hijo de Core #98 y acredita los mismos IDs, foto privada, resultado, selección, Budget y handoff; la evidencia y SHA de ese candidato son la referencia final de integración.

Rollback: retirar esta rama y conservar #33. No hay migraciones, deploy, credenciales o env nuevos. El saneamiento de Storage de #33 se conserva.
