import React, { createContext, useContext } from 'react';
import { unavailableSubscription } from './unavailableSubscription.js';

// The canonical ledger is server-only and not activated. Unknown is not zero.
const SubscriptionContext = createContext(unavailableSubscription);
export const SubscriptionProvider = ({children}) => (
  <SubscriptionContext.Provider value={unavailableSubscription}>{children}</SubscriptionContext.Provider>
);
export const useSubscription = () => useContext(SubscriptionContext);
