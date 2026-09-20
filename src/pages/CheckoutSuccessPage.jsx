import React from 'react';
import UnverifiedPaymentNotice from '@/components/checkout/UnverifiedPaymentNotice';

// A return route is not proof of payment, even when its name says success.
const CheckoutSuccessPage = () => <UnverifiedPaymentNotice />;

export default CheckoutSuccessPage;
