import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

import { useAuth } from "./AuthProvider";
import { getListedProductsBySellerId, getPurchasedProductsByBuyerId } from "api/api";

import { Sneaker } from "../../../shared";

type TransactionTableContextType = {
  isOpenSaleSuccessPopup: boolean;
  showListed: boolean;
  dualHistoryTableSneakers: Sneaker[] | undefined;
  sellerSoldSneakers: Sneaker[] | undefined
  handleOpenPopup: () => void;
  handleClosePopup: () => void;
  toggleShowListed: () => void;
};

const INIT_TRANSACTION_CONTEXT: TransactionTableContextType = {
  isOpenSaleSuccessPopup: false,
  showListed: true,
  dualHistoryTableSneakers: undefined,
  sellerSoldSneakers: undefined,
  handleOpenPopup: () => {},
  handleClosePopup: () => {},
  toggleShowListed: () => {},
};

const TransactionTableContext = createContext(INIT_TRANSACTION_CONTEXT);

export const useTransactionTableContext = () => useContext(TransactionTableContext);

const TransactionTableContextProvider = (props: { children: ReactNode }) => {
  const [isOpenSaleSuccessPopup, showIsOpenSaleSuccessPopup] = useState(false);
  const [showListed, setShowListed] = useState(true);

  const [dualHistoryTableSneakers, setDualHistoryTableSneakers] = useState<Sneaker[]>();
  const [listedProductsNotSold, setListedProductsNotSold] = useState<Sneaker[]>();
  const [purchasedProducts, setPurchasedProducts] = useState<Sneaker[]>();

  const [sellerSoldSneakers, setSellerSoldSneakers] = useState<Sneaker[]>()

  const { currentUser } = useAuth();

  useEffect(() => {
    (async () => {
      if (currentUser) {
        const fetchedListedProducts = await getListedProductsBySellerId(currentUser.id!);
        const fetchedPurchasedProducts = await getPurchasedProductsByBuyerId(currentUser.id!);
        
        const notSold = fetchedListedProducts.filter((p) => p.prodStatus !== 'sold');
        const sold = fetchedListedProducts.filter(p => p.prodStatus === 'sold')

        setListedProductsNotSold(notSold);
        setPurchasedProducts(fetchedPurchasedProducts);

        // initially showing the listed products that are 
        // not sold in the history table
        setDualHistoryTableSneakers(notSold);
        setSellerSoldSneakers(sold)
      }
    })();
  }, [isOpenSaleSuccessPopup, currentUser]);

  const handleOpenPopup = () => showIsOpenSaleSuccessPopup(true);
  const handleClosePopup = () => showIsOpenSaleSuccessPopup(false);

  const toggleShowListed = () => {
    if (showListed) setDualHistoryTableSneakers(purchasedProducts);
    else setDualHistoryTableSneakers(listedProductsNotSold);

    setShowListed(!showListed);
  };

  return (
    <TransactionTableContext.Provider
      value={{
        isOpenSaleSuccessPopup,
        showListed,
        dualHistoryTableSneakers,
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

export default TransactionTableContextProvider
