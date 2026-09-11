import React from 'react';
import { clientAuthBlocked, supplierAuthBlocked } from '@/contexts/identityContainment';

export default function IdentityUnavailable({ supplier = false }) {
  const message = supplier ? supplierAuthBlocked.error : clientAuthBlocked.error;
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
      <section aria-labelledby="identity-unavailable-title" className="max-w-md space-y-5">
        <h1 id="identity-unavailable-title" className="text-2xl font-bold">Gestión de cuentas no disponible</h1>
        <p role="status">{message}</p>
        <p>No se creó una cuenta ni se envió un correo de recuperación ni se cambió una contraseña.</p>
        <div className="flex flex-wrap gap-6">
          <a className="underline" href="/contacto">Contactar a INMEJORA</a>
          <a className="underline" href="/">Volver al inicio</a>
        </div>
      </section>
    </main>
  );
}
