import { apiCall } from '@/lib/apiClient';

export const mercadoPagoAPI = {
  createCheckout: async (planId) => {
    if (!planId) {
      throw new Error('planId is required');
    }
    return await apiCall('/api/horizon/checkout/mp', 'POST', { 
      planId,
      sellerName: import.meta.env.VITE_MERCADO_PAGO_SELLER_NAME || 'INMEJORA',
      mpToken: import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN,
      sellerId: import.meta.env.VITE_MERCADO_PAGO_SELLER_ID,
      publicKey: import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY
    });
  },
  
  createPreference: async (productId) => {
    if (!productId) {
      throw new Error('productId is required to create preference');
    }
    console.log("mercadoPagoAPI.createPreference called with productId:", productId);
    
    // Pass productId to the backend. Also pass INMEJORA identifier, seller ID, public key and the new "in mejora 3" token to the backend.
    // Ensure webhook notifications are routed to the correct endpoint for "in mejora 3" account.
    return await apiCall('/api/horizon/checkout/mp', 'POST', { 
      productId, 
      planId: productId,
      sellerName: import.meta.env.VITE_MERCADO_PAGO_SELLER_NAME || 'INMEJORA',
      mpToken: import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN,
      sellerId: import.meta.env.VITE_MERCADO_PAGO_SELLER_ID,
      publicKey: import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY,
      notificationUrl: `${import.meta.env.VITE_API_URL}/api/webhooks/mercadopago`
    });
  }
};