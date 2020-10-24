import React, { useContext, createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser } from 'utils/auth';
import { Hub } from 'aws-amplify';

import { User } from '../../../shared/@types/models';

type AuthContextType = {
  signedIn: boolean;
  currentUser: User | null;
  updateCurrentUser: (user: User) => void;
};

const INIT_AUTH_CONTEXT: AuthContextType = {
  signedIn: false,
  currentUser: null,
  updateCurrentUser: () => {
    throw new Error('Must override!');
  },
};

export const AuthContext = createContext(INIT_AUTH_CONTEXT);

const AuthProvider = (props: { children: ReactNode }) => {
  // TODO: can use a better cache strategy, so I can safely store
  // the user object as well maybe use something like mobx
  const storedSignedIn = JSON.parse(localStorage.getItem('signedIn') || 'false') as boolean;
  const [signedIn, setSignedIn] = useState(storedSignedIn);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const updateCurrentUser = (user: User) => setCurrentUser(user);

  const handleSignIn = async () => {
    setSignedIn(true);
    setCurrentUser(await getCurrentUser());
    localStorage.setItem('signedIn', 'true');
  };

  const handleSignOut = () => {
    setSignedIn(false);
    setCurrentUser(null);
    localStorage.setItem('signedIn', 'false');
  };

  useEffect(() => {
    getCurrentUser()
      .then(() => handleSignIn())
      .catch(() => handleSignOut());
  }, []);

  useEffect(() => {
    Hub.listen('auth', async ({ payload: { event } }) => {
      if (event === 'signIn') handleSignIn();
      if (event === 'signOut') handleSignOut();
    });

    return () => {
      Hub.remove('auth', () => {});
    };
  });

  return (
    <AuthContext.Provider value={{ signedIn, currentUser, updateCurrentUser }}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
