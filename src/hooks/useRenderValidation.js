import { useSubscription } from '@/contexts/SubscriptionContext';

export const useRenderValidation = () => {
  const { currentSubscription, creditsRemaining, isEligibleForRender, loading } = useSubscription();

  const validateRender = () => {
    if (loading) {
      return { isEligible: false, errorMessage: 'Verificando suscripción...', errorType: 'loading' };
    }

    if (!currentSubscription) {
      return { isEligible: false, errorMessage: 'No se encontró una suscripción activa.', errorType: 'no_subscription' };
    }

    if (currentSubscription.plan === 'mi_proyecto') {
        if (currentSubscription.project_status === 'finalizado') {
            return { isEligible: false, errorMessage: 'Proyecto finalizado. Acceso cerrado.', errorType: 'project_finished' };
        }
        // If it's mi_proyecto and not finalized, it's eligible
        return { isEligible: true, errorMessage: '', errorType: null };
    }

    if (currentSubscription.status !== 'active') {
      return { isEligible: false, errorMessage: `Tu suscripción está ${currentSubscription.status}. Por favor, renueva tu plan.`, errorType: 'inactive_subscription' };
    }

    if (creditsRemaining <= 0) {
      return { isEligible: false, errorMessage: 'No te quedan renders disponibles. Sube de plan o recarga créditos.', errorType: 'no_credits' };
    }

    if (!isEligibleForRender) {
        return { isEligible: false, errorMessage: 'No eres elegible para renderizar en este momento.', errorType: 'general_ineligible' };
    }

    return { isEligible: true, errorMessage: '', errorType: null };
  };

  return { validateRender };
};