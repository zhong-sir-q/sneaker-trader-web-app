import * as React from 'react';
import { AuthState } from '@aws-amplify/ui-components';

const INIT_CONTEXT = {
  authState: '',
  updateAuthState: (newState: AuthState) => {},
  isUserSignedIn: () => false,
};

export const AuthStateContext = React.createContext(INIT_CONTEXT);

// TODO: decide whether it is more appropriate to provide the authstate or the user context
const AuthStateProvider = (props: { children: React.ReactNode }) => {
  const [authState, setAuthState] = React.useState('');

  const updateAuthState = (newAuthState: AuthState) => setAuthState(newAuthState);

  const isUserSignedIn = () => authState === AuthState.SignedIn;

  return <AuthStateContext.Provider value={{ authState, updateAuthState, isUserSignedIn }}>{props.children}</AuthStateContext.Provider>;
};

export default AuthStateProvider;
