import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';

const CreditsDisplay = () => {
  const { error } = useSubscription();
  return <div className="rounded-xl border border-gray-700 p-4" role="status">
    <p>{error || 'Saldo pendiente de acreditar en el ledger canónico.'}</p>
    <p>Generación deshabilitada. No se consumen créditos.</p>
  </div>;
};
export default CreditsDisplay;
