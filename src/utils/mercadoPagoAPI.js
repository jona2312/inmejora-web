const unavailable = () => {
  const error = new Error('Pagos temporalmente no disponibles. No se inició ningún pago.');
  error.code = 'PAYMENTS_TEMPORARILY_UNAVAILABLE';
  return error;
};

// Deny direct calls as well as UI calls. Re-enablement requires a reviewed change.
export const mercadoPagoAPI = {
  createCheckout: async (planId) => {
    void planId;
    throw unavailable();
  },

  createPreference: async (productId) => {
    void productId;
    throw unavailable();
  },
};
