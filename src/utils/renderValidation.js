export const checkRenderEligibility = (subscription) => {
  if (!subscription) {
    return { eligible: false, message: "No se encontró una suscripción activa." };
  }

  if (subscription.status !== 'active') {
    return { eligible: false, message: `Tu suscripción se encuentra ${subscription.status}. Por favor, renueva tu plan.` };
  }

  if (subscription.plan === 'finalizado') {
    return { eligible: false, message: "Este proyecto ya ha finalizado." };
  }

  if (subscription.credits_remaining <= 0) {
    return { eligible: false, message: "No te quedan renders disponibles. Sube de plan o recarga créditos para continuar." };
  }

  return { eligible: true, message: "Elegible para renderizar" };
};