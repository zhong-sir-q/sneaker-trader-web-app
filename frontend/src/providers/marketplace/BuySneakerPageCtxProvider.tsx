import React, { createContext, ReactNode, useContext, useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { concatPaths } from 'api/formatApiEndpoint';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import SneakerControllerInstance from 'api/controllers/SneakerController';

import { HOME } from 'routes';

import { Sneaker, SizeMinPriceGroupType, SneakerAsk } from '../../../../shared';

type Size = number | 'all';

type BuySneakerPageCtxType = {
  selectedSize: Size;
  displaySneaker: Sneaker | undefined;
  sizeMinPriceGroup: SizeMinPriceGroupType | undefined;
  filterAllAsks: SneakerAsk[] | undefined;
  openViewAskModal: boolean;
  chooseBuyAll: boolean;
  onViewAllAsks: () => void;
  onCloseViewAllAsksModal: () => void;
  onClickSize: (size: Size) => void;
  onBuy: () => void;
};

const INIT_CTX: BuySneakerPageCtxType = {
  selectedSize: 'all',
  displaySneaker: undefined,
  sizeMinPriceGroup: undefined,
  filterAllAsks: undefined,
  openViewAskModal: false,
  chooseBuyAll: false,
  onCloseViewAllAsksModal: () => {
    throw new Error('Must override!');
  },
  onViewAllAsks: () => {
    throw new Error('Must override!');
  },
  onClickSize: () => {
    throw new Error('Must override!');
  },
  onBuy: () => {
    throw new Error('Must override!');
  },
};

const BuySneakerPageCtx = createContext(INIT_CTX);

export const useBuySneakerPageCtx = () => useContext(BuySneakerPageCtx);

const nameColorwayFromPath = () => {
  const { pathname } = window.location;

  const pathArray = pathname.split('/');
  const shoeNameColorway = pathArray[pathArray.length - 1].split('-').join(' ');

  return shoeNameColorway;
};

const BuySneakerPageCtxProvider = (props: { children: ReactNode }) => {
  const [selectedSize, setSelectedSize] = useState<Size>('all');
  const [displaySneaker, setDisplaySneaker] = useState<Sneaker>();
  const [sizeMinPriceGroup, setSizeMinPriceGroup] = useState<SizeMinPriceGroupType>();

  const [allAsks, setAllAsks] = useState<SneakerAsk[]>();
  const [filterAllAsks, setFilterAllAsks] = useState<SneakerAsk[]>();

  const [openViewAskModal, setOpenViewAskModal] = useState(false);
  const [chooseBuyAll, setChooseBuyAll] = useState(false);

  const history = useHistory();

  const onComponentMounted = useCallback(async () => {
    const shoeNameColorway = nameColorwayFromPath();
    const sizeMinPriceItems = await ListedSneakerControllerInstance.getSizeMinPriceGroupByNameColorway(
      shoeNameColorway
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
  }, [history]);

  useEffect(() => {
    onComponentMounted();
  }, [onComponentMounted]);

  const onClickSize = (size: Size) => setSelectedSize(size);

  const onViewAllAsks = () => {
    setOpenViewAskModal(true);

    if (selectedSize === 'all') setFilterAllAsks(allAsks);
    else setFilterAllAsks(allAsks?.filter((ask) => ask.size === selectedSize));
  };

  const onBuy = () => {
    if (selectedSize === 'all') {
      setChooseBuyAll(true);
      return;
    }

    history.push(concatPaths(history.location.pathname, selectedSize));
  };

  const onCloseViewAllAsksModal = () => setOpenViewAskModal(false)

  return (
    <BuySneakerPageCtx.Provider
      value={{
        selectedSize,
        displaySneaker,
        sizeMinPriceGroup,
        filterAllAsks,
        openViewAskModal,
        chooseBuyAll,
        onCloseViewAllAsksModal,
        onViewAllAsks,
        onBuy,
        onClickSize,
      }}
    >
      {props.children}
    </BuySneakerPageCtx.Provider>
  );
};

export default BuySneakerPageCtxProvider;
