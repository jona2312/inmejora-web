import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';

const PlanManagementPage = () => {
  const subscription = useSubscription();
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Mi Suscripción</h1>
      <p role="status">{subscription.error}</p>
      <p className="my-4">Plan, saldo y facturación: No disponible. No se realizó ninguna compra ni cancelación.</p>
      <Link to="/portal"><Button>Volver al Portal</Button></Link>
    </main>
  );
};
export default PlanManagementPage;
