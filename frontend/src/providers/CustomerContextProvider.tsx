import * as React from 'react';

const INIT_CONTEXT = {
  customerId: '',
  updateCustomerId: (newCustomerId: string) => {},
};

export const CustomerContext = React.createContext(INIT_CONTEXT);

// TODO: decide whether it is more appropriate to provide the authstate or the user context
const CustomerContextProvider = (props: { children: React.ReactNode }) => {
  const [customerId, setCustomerId] = React.useState('');
  const updateCustomerId = (newCustomerId: string) => setCustomerId(newCustomerId);

  return <CustomerContext.Provider value={{ customerId, updateCustomerId }}>{props.children}</CustomerContext.Provider>;
};

export default CustomerContextProvider;
