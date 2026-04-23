import crypto from 'crypto';

/**
 * Backend utility for processing Mercado Pago webhooks.
 * Note: This code is intended to be run in a Node.js/Server environment.
 */
export class MercadoPagoWebhookHandler {
  constructor(accessToken, webhookSecret) {
    this.accessToken = accessToken;
    this.webhookSecret = webhookSecret;
  }

  /**
   * Verifies the webhook signature from Mercado Pago.
   * @param {string} xSignature - The x-signature header value
   * @param {string} xRequestId - The x-request-id header value
   * @param {object} data - The raw request body
   * @returns {boolean} True if signature is valid
   */
  verifyWebhookSignature(xSignature, xRequestId, data) {
    if (!xSignature || !xRequestId || !data) return false;

    try {
      // Parse the x-signature header (format: "ts=...,v1=...")
      const parts = xSignature.split(',');
      let ts, v1;

      parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key === 'ts') ts = value;
        if (key === 'v1') v1 = value;
      });

      if (!ts || !v1) return false;

      // Create manifest string
      const manifest = `id:${data.data?.id};request-id:${xRequestId};ts:${ts};`;

      // Generate HMAC SHA256 signature
      const hmac = crypto.createHmac('sha256', this.webhookSecret);
      hmac.update(manifest);
      const calculatedSignature = hmac.digest('hex');

      return calculatedSignature === v1;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * Processes a payment webhook.
   * @param {object} payload - The webhook payload
   * @param {function} updateDatabaseCb - Callback to update DB
   */
  async processPaymentWebhook(payload, updateDatabaseCb) {
    const { action, data, type } = payload;

    // We only care about payment updates
    if (type !== 'payment') {
      console.log(`Ignoring webhook of type: ${type}`);
      return { success: true, message: 'Ignored' };
    }

    const paymentId = data.id;

    try {
      // 1. Get payment details from Mercado Pago API
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payment details: ${response.statusText}`);
      }

      const paymentData = await response.json();
      
      const status = paymentData.status; // 'approved', 'pending', 'rejected', etc.
      const externalReference = paymentData.external_reference; // Usually our internal user/order ID
      const metadata = paymentData.metadata || {};

      console.log(`Processing payment ${paymentId}. Status: ${status}`);

      // 2. Idempotency Check & Database Update
      // The callback should check if this payment was already processed
      // and update the subscription/credits accordingly.
      const dbResult = await updateDatabaseCb({
        paymentId,
        status,
        externalReference,
        planId: metadata.plan_id,
        userId: metadata.user_id,
        amount: paymentData.transaction_amount,
        rawPaymentData: paymentData
      });

      if (!dbResult.success) {
        throw new Error(`Database update failed: ${dbResult.error}`);
      }

      // 3. Trigger emails (Mocked here, would integrate with Resend/SendGrid)
      if (status === 'approved' && dbResult.isNewApproval) {
        this.sendConfirmationEmail(metadata.email, metadata.plan_name);
      } else if (status === 'rejected') {
        this.sendFailureEmail(metadata.email);
      }

      return { success: true, status };

    } catch (error) {
      console.error('Error processing webhook:', error);
      // Throwing error will cause MP to retry later
      throw error; 
    }
  }

  sendConfirmationEmail(email, planName) {
    console.log(`[Email Mock] Sent confirmation to ${email} for plan ${planName}`);
  }

  sendFailureEmail(email) {
    console.log(`[Email Mock] Sent payment failure notice to ${email}`);
  }
}