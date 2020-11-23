import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import _ from 'lodash';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import MailControllerInstance from 'api/controllers/MailController';
import SellerControllerInstance from 'api/controllers/SellerController';
import SneakerControllerInstance from 'api/controllers/SneakerController';
import TransactionControllerInstance from 'api/controllers/TransactionController';
import WalletControllerInstance from 'api/controllers/WalletController';

import ViewSellersList from 'pages/ViewSellersList';
import { useAuth } from 'providers/AuthProvider';

import { AUTH, HOME, SIGNIN } from 'routes';

import getTransactionFees from 'usecases/getTransactionFee';
import onConfirmPurchaseSneaker from 'usecases/onConfirmPurchaseSneaker';

import { CreateTransactionPayload, ListedSneakerSeller, Sneaker } from '../../../shared';

import sneakerInfoFromPath from 'utils/sneakerInfoFromPath';

class NoSuchSneakerInDbError extends Error {}

const ViewSellersListContainer = () => {
  const [sellers, setSellers] = useState<ListedSneakerSeller[]>();
  const [selectedSellerIdx, setSelectedSellerIdx] = useState<number>(-1);
  const [displaySneaker, setDisplaySneaker] = useState<Sneaker>();
  // use this state so ViewSellerList will do load animation if it is true
  const [processingPurchase, setProcessingPurchase] = useState(false);

  const history = useHistory();

  const { signedIn, currentUser } = useAuth();

  useEffect(() => {
    (async () => {
      if (!signedIn) {
        // use localStorage to cache the route, because the state will be cleared after redirect
        localStorage.setItem('cached_route', history.location.pathname)
        history.push(AUTH + SIGNIN, history.location.pathname);
        return;
      }

      // signed in, but allow some time to fetch the user object
      if (!currentUser) return

      const sneakerInfo = sneakerInfoFromPath(history.location.pathname);

      const sneakerToBuy = await SneakerControllerInstance.getByNameColorwaySize(
        sneakerInfo.nameColorway,
        sneakerInfo.size
      );

      if (!sneakerToBuy) throw new NoSuchSneakerInDbError();

      setDisplaySneaker(sneakerToBuy);

      const sellersBySneakerNameSize = await SellerControllerInstance.getSellersBySneakerNameSize(
        currentUser.id,
        sneakerInfo.nameColorway,
        sneakerInfo.size
      );

      setSellers(sellersBySneakerNameSize);
    })();
  }, [currentUser, history, signedIn]);

  useEffect(() => {
    // all listed sneakers are from the current user, hence redirect the user back home
    if (sellers && sellers.length === 0) history.push(HOME);
  }, [sellers, history]);

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

  const handleConfirmPurchase = async () => {
    if (!sellers) return;

    const sneakerInfo = sneakerInfoFromPath(history.location.pathname);

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

    const mailPayload = {
      sellerEmail: email,
      sellerUserName: username,
      buyerUserName: currentUser!.username,
      buyerEmail: currentUser!.email,
      productName: `Size ${sneakerInfo.size} ${sneakerInfo.nameColorway}`,
    };

    await onConfirmPurchaseSneaker(
      ListedSneakerControllerInstance,
      TransactionControllerInstance,
      WalletControllerInstance,
      MailControllerInstance
    )(mailPayload, transaction, decreaseWalletBalPayload);

    // after success purchase
    alert('The seller will be in touch with you shortly');
    history.push(HOME);
    window.location.reload();
  };

  const onCancel = () => history.goBack();

  const onConfirm = async () => {
    setProcessingPurchase(true);
    await handleConfirmPurchase();
    setProcessingPurchase(false);
  };

  const onSelectSeller = (idx: number) => setSelectedSellerIdx(idx);

  return (
    <ViewSellersList
      {...{
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
    />
  );
};

export default ViewSellersListContainer;
