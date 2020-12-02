import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from 'providers/AuthProvider';

import { HOME } from 'routes';
import { concatPaths } from 'utils/formatApiEndpoint';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import SneakerControllerInstance from 'api/controllers/SneakerController';

import BuySneakerPage from 'pages/BuySneakerPage';

import { Sneaker, SizeMinPriceGroupType, SneakerAsk, Size } from '../../../shared';
import AlertDialog from 'components/AlertDialog';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import { nameColorwayFromPath } from 'utils/utils';

const BuySneakerPageContainer = () => {
  const [selectedSize, setSelectedSize] = useState<Size>('all');
  const [displaySneaker, setDisplaySneaker] = useState<Sneaker>();
  const [sizeMinPriceGroup, setSizeMinPriceGroup] = useState<SizeMinPriceGroupType>();

  const [allAsks, setAllAsks] = useState<SneakerAsk[]>();
  const [filterAllAsks, setFilterAllAsks] = useState<SneakerAsk[]>();

  const [openViewAskModal, setOpenViewAskModal] = useState(false);
  const [chooseBuyAll, setChooseBuyAll] = useState(false);

  const [selectedSizeMinPrice, setSelectedSizeMinPrice] = useState<number>();

  const alertDialogHook = useOpenCloseComp();

  const { currentUser } = useAuth();

  const history = useHistory();

  const onComponentMounted = useCallback(async () => {
    const [shoeName, shoeColorway] = nameColorwayFromPath(window.location.pathname);

    const sizeMinPriceItems = await ListedSneakerControllerInstance.getSizeMinPriceGroupByNameColorway(
      shoeName,
      shoeColorway,
      currentUser ? currentUser.id : -1
    );

    const asks = await ListedSneakerControllerInstance.getAllAsksByNameColorway(shoeName, shoeColorway);

    const sneaker = await SneakerControllerInstance.getFirstByNameColorway(shoeName, shoeColorway);

    if (!sneaker) {
      history.push(HOME);
      return;
    }

    setAllAsks(asks);
    setFilterAllAsks(asks);

    setDisplaySneaker(sneaker);
    setSizeMinPriceGroup(sizeMinPriceItems);
  }, [history, currentUser]);

  useEffect(() => {
    onComponentMounted();
  }, [onComponentMounted]);

  const onClickSizeTile = (size: Size, minPrice: number) => {
    setSelectedSize(size);
    setSelectedSizeMinPrice(minPrice);
  };

  const onViewAllAsks = () => {
    setOpenViewAskModal(true);

    if (selectedSize === 'all') setFilterAllAsks(allAsks);
    else setFilterAllAsks(allAsks?.filter((ask) => ask.size === selectedSize));
  };

  const onBuy = () => {
    if (!selectedSize) return;

    if (selectedSize === 'all') {
      setChooseBuyAll(true);
      alertDialogHook.onOpen();
      return;
    }

    history.push(concatPaths(history.location.pathname, selectedSize));
  };

  const onCloseViewAllAsksModal = () => setOpenViewAskModal(false);

  return (
    <React.Fragment>
      <BuySneakerPage
        {...{
          selectedSize,
          displaySneaker,
          sizeMinPriceGroup,
          filterAllAsks,
          openViewAskModal,
          chooseBuyAll,
          selectedSizeMinPrice,
          onCloseViewAllAsksModal,
          onViewAllAsks,
          onBuy,
          onClickSizeTile,
        }}
      />
      <AlertDialog
        open={alertDialogHook.open}
        color='info'
        message='Please select a size!'
        onClose={alertDialogHook.onClose}
      />
    </React.Fragment>
  );
};

export default BuySneakerPageContainer;
