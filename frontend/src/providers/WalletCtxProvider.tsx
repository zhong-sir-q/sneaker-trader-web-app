import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

import WalletControllerInstance from 'api/controllers/WalletController';

import { useAuth } from './AuthProvider';

type WalletCtxType = {
  walletBalance: number;
  goFetchBalance: () => void;
};

const INIT_CTX: WalletCtxType = {
  walletBalance: 0,
  goFetchBalance: () => {
    throw new Error('Must override!');
  },
};

const WalletCtx = createContext(INIT_CTX);

export const useWalletCtx = () => useContext(WalletCtx);

const WalletCtxProvider = (props: { children: ReactNode }) => {
  const [fetchBalance, setFetchBalance] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);

  const { currentUser } = useAuth();

  const goFetchBalance = () => setFetchBalance(true);
  const endFetchBalance = () => setFetchBalance(false);

  useEffect(() => {
    (async () => {
      if (fetchBalance && currentUser) {
        const balance = await WalletControllerInstance.getBalanceByUserId(currentUser.id);

        setWalletBalance(balance);
        endFetchBalance();
      }
    })();
  }, [fetchBalance, currentUser]);

  return <WalletCtx.Provider value={{ walletBalance, goFetchBalance }}>{props.children}</WalletCtx.Provider>;
};

export default WalletCtxProvider;
