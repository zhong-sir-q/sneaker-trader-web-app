import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import { useAuth } from 'providers/AuthProvider';

import SneakerControllerInstance from 'api/controllers/SneakerController';
import SellerControllerInstance from 'api/controllers/SellerController';

import getTransactionFees from 'usecases/getTransactionFee';
import onConfirmPurchaseSneaker from 'usecases/onConfirmPurchaseSneaker';

import { AUTH, SIGNIN, HOME } from 'routes';

import { ListedSneakerSeller, Sneaker, CreateTransactionPayload } from '../../../../shared';

import _ from 'lodash';

type ViewSellersListCtxType = {
  sellers: ListedSneakerSeller[] | undefined;
  selectedSellerIdx: number;
  displaySneaker: Sneaker | undefined;
  processingPurchase: boolean;
  sortSellersByAskingPriceAscending: () => void;
  sortSellersByAskingPriceDescending: () => void;
  onCancel: () => void;
  onSelectSeller: (sellerIdx: number) => void;
  onConfirm: () => void;
};

const INIT_CTX: ViewSellersListCtxType = {
  sellers: undefined,
  selectedSellerIdx: -1,
  displaySneaker: undefined,
  processingPurchase: false,
  sortSellersByAskingPriceAscending: () => {
    throw new Error('Must override!');
  },
  sortSellersByAskingPriceDescending: () => {
    throw new Error('Must override!');
  },
  onCancel: () => {
    throw new Error('Must override!');
  },
  onSelectSeller: () => {
    throw new Error('Must override!');
  },
  onConfirm: () => {
    throw new Error('Must override!');
  },
};

const ViewSellersListCtx = createContext(INIT_CTX);

export const useViewSellersListCtx = () => useContext(ViewSellersListCtx);

const sneakerInfoFromPath = (history: any) => {
  const sneakerInfo = history.location.pathname.split('/');
  const sneakerNameColorway = sneakerInfo[2].split('-').join(' ');
  const sneakerSize = Number(sneakerInfo[sneakerInfo.length - 1]);

  return { nameColorway: sneakerNameColorway, size: sneakerSize };
};

const ViewSellersListCtxProvider = (props: { children: ReactNode }) => {
  const [sellers, setSellers] = useState<ListedSneakerSeller[]>();
  const [selectedSellerIdx, setSelectedSellerIdx] = useState<number>(-1);
  const [displaySneaker, setDisplaySneaker] = useState<Sneaker>();
  const [processingPurchase, setProcessingPurchase] = useState(false);

  const history = useHistory();

  const { signedIn, currentUser } = useAuth();

  const sneakerInfo = sneakerInfoFromPath(history);

  useEffect(() => {
    (async () => {
      if (!signedIn) {
        history.push(AUTH + SIGNIN, history.location.pathname);
        return;
      }

      const sneakerToBuy = await SneakerControllerInstance.getByNameColorwaySize(
        sneakerInfo.nameColorway,
        sneakerInfo.size
      );

      if (sneakerToBuy) setDisplaySneaker(sneakerToBuy);

      if (currentUser) {
        const sellersBySneakerNameSize = await SellerControllerInstance.getSellersBySneakerNameSize(
          currentUser.id,
          sneakerInfo.nameColorway,
          sneakerInfo.size
        );

        setSellers(sellersBySneakerNameSize);
      }
    })();
  }, [currentUser, history, signedIn, sneakerInfo.nameColorway, sneakerInfo.size]);

  useEffect(() => {
    // all listed sneakers are from the current user, hence redirect the user back home
    if (sellers && sellers.length === 0) history.push(HOME);
  }, [sellers, history]);

  // handleConfirmPurchase
  useEffect(() => {
    if (processingPurchase) {
      (async () => {
        if (!sellers) return;

        const sellerId = sellers[selectedSellerIdx].id;
        const { askingPrice, listedProductId, email, username } = sellers[selectedSellerIdx];

        const processingFee = getTransactionFees(askingPrice);

        const transaction: CreateTransactionPayload = {
          buyerId: currentUser!.id!,
          sellerId,
          amount: askingPrice,
          processingFee,
          listedProductId,
        };

        const decreaseWalletBalPayload = { userId: sellerId, amount: processingFee };

        await onConfirmPurchaseSneaker(
          {
            sellerEmail: email,
            sellerUserName: username,
            buyerUserName: currentUser!.username,
            buyerEmail: currentUser!.email,
            productName: `Size ${sneakerInfo.size} ${sneakerInfo.nameColorway}`,
          },
          transaction,
          listedProductId,
          sellerId,
          decreaseWalletBalPayload
        );

        // after success purchase
        alert('The seller will be in touch with you shortly');
        history.push(HOME);
        window.location.reload();

        setProcessingPurchase(false);
      })();
    }
  }, [
    processingPurchase,
    history,
    currentUser,
    sellers,
    selectedSellerIdx,
    sneakerInfo.nameColorway,
    sneakerInfo.size,
  ]);

  const sortSellersByAskingPriceAscending = () => {
    if (!sellers) return;

    const ascSellers = _.orderBy(sellers, ['askingPrice'], ['asc']);

    if (selectedSellerIdx > -1) {
      const sellerListedSneakerIdBeforeSort = sellers[selectedSellerIdx].listedProductId;
      const sellerIdxAfterSort = ascSellers.findIndex(
        (seller) => seller.listedProductId === sellerListedSneakerIdBeforeSort
      );
      setSelectedSellerIdx(sellerIdxAfterSort);
    }

    setSellers(ascSellers);
  };

  const sortSellersByAskingPriceDescending = () => {
    if (!sellers) return;

    const descSellers = _.orderBy(sellers, ['askingPrice'], ['desc']);

    if (selectedSellerIdx > -1) {
      const sellerListedSneakerIdBeforeSort = sellers[selectedSellerIdx].listedProductId;
      const sellerIdxAfterSort = descSellers.findIndex(
        (seller) => seller.listedProductId === sellerListedSneakerIdBeforeSort
      );
      setSelectedSellerIdx(sellerIdxAfterSort);
    }

    setSellers(descSellers);
  };

  const onCancel = () => history.goBack();

  const onConfirm = () => setProcessingPurchase(true);

  const onSelectSeller = (idx: number) => setSelectedSellerIdx(idx);

  return (
    <ViewSellersListCtx.Provider
      value={{
        sellers,
        selectedSellerIdx,
        displaySneaker,
        sortSellersByAskingPriceAscending,
        sortSellersByAskingPriceDescending,
        onSelectSeller,
        onCancel,
        onConfirm,
        processingPurchase,
      }}
    >
      {props.children}
    </ViewSellersListCtx.Provider>
  );
};

export default ViewSellersListCtxProvider;
