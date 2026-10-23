import React from 'react';

const RenderWizardContainer = () => (
  <section className="rounded-xl border border-gray-700 p-6 space-y-3" aria-label="Generación de renders">
    <h2 className="text-xl font-bold">Generación todavía no habilitada</h2>
    <p>Podés guardar tu consulta y fotos privadas en el proyecto. No se generará un render ni se consumirán créditos.</p>
    <button type="button" disabled className="rounded-lg border border-gray-600 px-4 py-2">Solicitar render — no disponible</button>
    <p><a href="/contacto" className="underline">Abrir mi consulta</a></p>
  </section>
);
export default RenderWizardContainer;
