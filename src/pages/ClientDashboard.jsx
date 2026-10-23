import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/InmejoraAuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

// No separate anonymous ledger or fake render statistics: the project CRM and
// canonical ledger must provide these values before any balances are displayed.
const ClientDashboard = () => {
  const { user } = useAuth();
  const { error } = useSubscription();
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 lg:px-8 py-12 pt-28 max-w-[1200px]">
        <h1 className="text-3xl font-bold mb-4">Mi espacio INMEJORA</h1>
        <p className="text-gray-300 mb-5">Bienvenido, {user?.full_name || user?.name || 'Usuario'}.</p>
        <section className="rounded-xl border border-gray-700 bg-[#1a1a1a] p-6 space-y-4">
          <h2 className="text-xl font-semibold">Renders y créditos</h2>
          <p role="status">{error || 'Todavía no hay un saldo acreditado por Project Core.'}</p>
          <p>La generación de renders no está habilitada. No se descontarán créditos ni se mostrarán resultados simulados.</p>
          <Link to="/contacto" className="inline-block rounded-lg bg-[#d4af37] text-black font-semibold px-4 py-3">Enviar consulta y fotografías</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
