import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

import { useAuth } from './AuthProvider';
import { getPurchasedProductsByBuyerId } from 'api/api';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../shared';
import ListedSneakerControllerInstance from 'api/ListedSneakerController';

type TransactionTableContextType = {
  isOpenSaleSuccessPopup: boolean;
  showListed: boolean;
  unsoldListedSneakers: SellerListedSneaker[];
  purchasedSneakers: BuyerPurchasedSneaker[];
  sellerSoldSneakers: SellerListedSneaker[];
  handleOpenPopup: () => void;
  handleClosePopup: () => void;
  toggleShowListed: () => void;
};

const INIT_TRANSACTION_CONTEXT: TransactionTableContextType = {
  isOpenSaleSuccessPopup: false,
  showListed: true,
  unsoldListedSneakers: [],
  purchasedSneakers: [],
  sellerSoldSneakers: [],
  handleOpenPopup: () => {},
  handleClosePopup: () => {},
  toggleShowListed: () => {},
};

const TransactionTableContext = createContext(INIT_TRANSACTION_CONTEXT);

export const useTransactionTableContext = () => useContext(TransactionTableContext);

const TransactionTableContextProvider = (props: { children: ReactNode }) => {
  const [isOpenSaleSuccessPopup, showIsOpenSaleSuccessPopup] = useState(false);
  const [showListed, setShowListed] = useState(true);

  const [unsoldListedSneakers, setUnsoldListedSneakers] = useState<SellerListedSneaker[]>([]);
  const [purchasedSneakers, setPurchasedSneakers] = useState<BuyerPurchasedSneaker[]>([]);

  const [sellerSoldSneakers, setSellerSoldSneakers] = useState<SellerListedSneaker[]>([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    (async () => {
      if (currentUser) {
        const fetchedPurchasedProducts = await getPurchasedProductsByBuyerId(currentUser.id);

        const notSold = await ListedSneakerControllerInstance.getUnsoldListedSneakers(currentUser.id);
        const sold = await ListedSneakerControllerInstance.getSoldListedSneakers(currentUser.id);

        setUnsoldListedSneakers(notSold);
        setPurchasedSneakers(fetchedPurchasedProducts);

        setSellerSoldSneakers(sold);
      }
    })();
  }, [isOpenSaleSuccessPopup, currentUser]);

  const handleOpenPopup = () => showIsOpenSaleSuccessPopup(true);
  const handleClosePopup = () => showIsOpenSaleSuccessPopup(false);

  const toggleShowListed = () => setShowListed(!showListed);

  return (
    <TransactionTableContext.Provider
      value={{
        isOpenSaleSuccessPopup,
        showListed,
        purchasedSneakers,
        unsoldListedSneakers,
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

export default TransactionTableContextProvider;
