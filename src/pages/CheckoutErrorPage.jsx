import React from 'react';
import UnverifiedPaymentNotice from '@/components/checkout/UnverifiedPaymentNotice';

// Preserve navigation to plans without inviting another payment attempt.
const CheckoutErrorPage = () => <UnverifiedPaymentNotice showPlans />;

export default CheckoutErrorPage;
