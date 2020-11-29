import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

import { useAuth } from './AuthProvider';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../shared';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import TransactionControllerInstance from 'api/controllers/TransactionController';
import useOpenCloseComp from 'hooks/useOpenCloseComp';

type TransactionTableContextType = {
  showListed: boolean;
  isOpenSaleSuccessPopup: boolean;
  unsoldListedSneakers: SellerListedSneaker[] | undefined;
  purchasedSneakers: BuyerPurchasedSneaker[] | undefined;
  sellerSoldSneakers: SellerListedSneaker[] | undefined;
  removeUnsoldSneakers: (id: number) => void;
  handleOpenPopup: () => void;
  handleClosePopup: () => void;
  toggleShowListed: () => void;
};

const INIT_TRANSACTION_CONTEXT: TransactionTableContextType = {
  isOpenSaleSuccessPopup: false,
  showListed: true,
  unsoldListedSneakers: undefined,
  purchasedSneakers: undefined,
  sellerSoldSneakers: undefined,
  removeUnsoldSneakers: () => { throw new Error('Must override!') },
  handleOpenPopup: () => { throw new Error('Must override!') },
  handleClosePopup: () => { throw new Error('Must override!') },
  toggleShowListed: () => { throw new Error('Must override!') },
};

const TransactionTableContext = createContext(INIT_TRANSACTION_CONTEXT);

export const useTransactionTableContext = () => useContext(TransactionTableContext);

const TransactionTableProvider = (props: { children: ReactNode }) => {
  const openCloseSaleSuccessHook = useOpenCloseComp();

  const isOpenSaleSuccessPopup = openCloseSaleSuccessHook.open;
  const handleClosePopup = openCloseSaleSuccessHook.onClose;
  const handleOpenPopup = openCloseSaleSuccessHook.onOpen;

  const [showListed, setShowListed] = useState(true);

  const [unsoldListedSneakers, setUnsoldListedSneakers] = useState<SellerListedSneaker[]>();
  const [purchasedSneakers, setPurchasedSneakers] = useState<BuyerPurchasedSneaker[]>();

  const [sellerSoldSneakers, setSellerSoldSneakers] = useState<SellerListedSneaker[]>();

  const { currentUser } = useAuth();

  const removeUnsoldSneakers = (id: number) => {
    const unsold = unsoldListedSneakers?.filter(s => s.id !== id)
    setUnsoldListedSneakers(unsold)
  }

  useEffect(() => {
    (async () => {
      if (currentUser) {
        const fetchedPurchasedProducts = await TransactionControllerInstance.getPurchasedSneakersByBuyerId(
          currentUser.id
        );

        const notSold = await ListedSneakerControllerInstance.getUnsoldListedSneakers(currentUser.id);
        const sold = await ListedSneakerControllerInstance.getSoldListedSneakers(currentUser.id);

        setUnsoldListedSneakers(notSold);
        setPurchasedSneakers(fetchedPurchasedProducts);

        setSellerSoldSneakers(sold);
      }
    })();
  }, [isOpenSaleSuccessPopup, currentUser]);

  const toggleShowListed = () => setShowListed(!showListed);

  return (
    <TransactionTableContext.Provider
      value={{
        isOpenSaleSuccessPopup,
        showListed,
        purchasedSneakers,
        unsoldListedSneakers,
        removeUnsoldSneakers,
        sellerSoldSneakers,
        handleClosePopup,
        handleOpenPopup,
        toggleShowListed,
      }}
    >
      {props.children}
    </TransactionTableContext.Provider>
  );
};

export default TransactionTableProvider;
