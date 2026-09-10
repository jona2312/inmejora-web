import React from 'react';
import UnverifiedPaymentNotice from '@/components/checkout/UnverifiedPaymentNotice';

// Preserve provider help without claiming that a payment is being processed.
const CheckoutPendingPage = () => <UnverifiedPaymentNotice showProviderHelp />;

export default CheckoutPendingPage;
