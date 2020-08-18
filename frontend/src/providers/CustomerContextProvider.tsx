import * as React from 'react';

const INIT_CONTEXT = {
  customerId: '', // the id from Stripe
  userId: '', // the id from Cognito
  updateCustomerId: (newCustomerId: string) => {},
  updateUserId: (newUserId: string) => {},
};

export const CustomerContext = React.createContext(INIT_CONTEXT);

// TODO: decide whether it is more appropriate to provide the authstate or the user context
const CustomerContextProvider = (props: { children: React.ReactNode }) => {
  const [customerId, setCustomerId] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const updateCustomerId = (newCustomerId: string) => setCustomerId(newCustomerId);
  const updateUserId = (newUserId: string) => setUserId(newUserId);

  return (
    <CustomerContext.Provider value={{ customerId, userId, updateCustomerId, updateUserId }}>{props.children}</CustomerContext.Provider>
  );
};

export default CustomerContextProvider;
