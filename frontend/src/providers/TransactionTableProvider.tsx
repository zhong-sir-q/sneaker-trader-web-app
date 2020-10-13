import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

import { useAuth } from './AuthProvider';

import { SellerListedSneaker, BuyerPurchasedSneaker } from '../../../shared';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import TransactionControllerInstance from 'api/controllers/TransactionController';
import useOpenCloseComp from 'hooks/useOpenCloseComp';

type TransactionTableContextType = {
  isFetchingTransactions: boolean;
  showListed: boolean;
  isOpenSaleSuccessPopup: boolean;
  unsoldListedSneakers: SellerListedSneaker[];
  purchasedSneakers: BuyerPurchasedSneaker[];
  sellerSoldSneakers: SellerListedSneaker[];
  handleOpenPopup: () => void;
  handleClosePopup: () => void;
  toggleShowListed: () => void;
};

const INIT_TRANSACTION_CONTEXT: TransactionTableContextType = {
  isFetchingTransactions: true,
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

const TransactionTableProvider = (props: { children: ReactNode }) => {
  const openCloseSaleSuccessHook = useOpenCloseComp()

  const isOpenSaleSuccessPopup = openCloseSaleSuccessHook.open
  const handleClosePopup = openCloseSaleSuccessHook.onClose
  const handleOpenPopup = openCloseSaleSuccessHook.onOpen

  const [showListed, setShowListed] = useState(true);
  const [isFetchingTransactions, setisFetchingTransactions] = useState(true);

  const [unsoldListedSneakers, setUnsoldListedSneakers] = useState<SellerListedSneaker[]>([]);
  const [purchasedSneakers, setPurchasedSneakers] = useState<BuyerPurchasedSneaker[]>([]);

  const [sellerSoldSneakers, setSellerSoldSneakers] = useState<SellerListedSneaker[]>([]);

  const { currentUser } = useAuth();

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
        setisFetchingTransactions(false);
      }
    })();
  }, [isOpenSaleSuccessPopup, currentUser]);

  const toggleShowListed = () => setShowListed(!showListed);

  return (
    <TransactionTableContext.Provider
      value={{
        isFetchingTransactions,
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

export default TransactionTableProvider;
