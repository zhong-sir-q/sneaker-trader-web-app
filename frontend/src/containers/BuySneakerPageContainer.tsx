import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAuth } from 'providers/AuthProvider';

import { HOME } from 'routes';
import { concatPaths } from 'utils/formatApiEndpoint';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import SneakerControllerInstance from 'api/controllers/SneakerController';

import BuySneakerPage from 'pages/BuySneakerPage';

import { Sneaker, SizeMinPriceGroupType, SneakerAsk, Size } from '../../../shared';

const nameColorwayFromPath = () => {
  const { pathname } = window.location;

  const pathArray = pathname.split('/');
  const shoeNameColorway = pathArray[pathArray.length - 1].split('-').join(' ');

  return shoeNameColorway;
};

const BuySneakerPageContainer = () => {
  const [selectedSize, setSelectedSize] = useState<Size>();
  const [displaySneaker, setDisplaySneaker] = useState<Sneaker>();
  const [sizeMinPriceGroup, setSizeMinPriceGroup] = useState<SizeMinPriceGroupType>();

  const [allAsks, setAllAsks] = useState<SneakerAsk[]>();
  const [filterAllAsks, setFilterAllAsks] = useState<SneakerAsk[]>();

  const [openViewAskModal, setOpenViewAskModal] = useState(false);
  const [chooseBuyAll, setChooseBuyAll] = useState(false);

  const [selectedSizeMinPrice, setSelectedSizeMinPrice] = useState<number>();

  const { currentUser } = useAuth();

  const history = useHistory();

  const onComponentMounted = useCallback(async () => {
    const shoeNameColorway = nameColorwayFromPath();
    const sizeMinPriceItems = await ListedSneakerControllerInstance.getSizeMinPriceGroupByNameColorway(
      shoeNameColorway,
      currentUser ? currentUser.id : -1
    );
    const asks = await ListedSneakerControllerInstance.getAllAsksByNameColorway(shoeNameColorway);

    const sneaker = await SneakerControllerInstance.getFirstByNameColorway(shoeNameColorway);

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
      return;
    }

    history.push(concatPaths(history.location.pathname, selectedSize));
  };

  const onCloseViewAllAsksModal = () => setOpenViewAskModal(false);

  return (
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
  );
};

export default BuySneakerPageContainer;
