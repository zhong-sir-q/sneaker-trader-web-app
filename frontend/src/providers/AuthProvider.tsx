import React, { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from 'utils/auth';
import { Hub } from 'aws-amplify';

const INIT_AUTH_CONTEXT = {
  signedIn: false,
};

const AuthContext = createContext(INIT_AUTH_CONTEXT);

const AuthProvider = (props: { children: ReactNode }) => {
  const [signedIn, setSignedIn] = useState(false);
  const history = useHistory();

  const handleSignIn = () => setSignedIn(true);

  const handleSignOut = () => setSignedIn(false);

  useEffect(() => {
    getCurrentUser()
      .then(() => handleSignIn())
      .catch(() => handleSignOut());
  });

  useEffect(() => {
    Hub.listen('auth', async ({ payload: { event } }) => {
      if (event === 'signIn') handleSignIn();
      if (event === 'signOut') handleSignOut();
    });

    return () => {
      Hub.remove('auth', () => {});
    };
  });

  return <AuthContext.Provider value={{ signedIn }}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
