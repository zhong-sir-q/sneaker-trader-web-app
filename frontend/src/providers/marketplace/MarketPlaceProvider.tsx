import React, { createContext, ReactNode, useContext, useState, useEffect, useCallback } from 'react';

import { useAuth } from 'providers/AuthProvider';

import ListedSneakerControllerInstance, { ListedSneakerController } from 'api/controllers/ListedSneakerController';
import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';

import { GallerySneaker } from '../../../../shared';

import _ from 'lodash';
import { FilterByKey } from 'components/marketplace/filters/filter';

type FilterItem = {
  type: FilterByKey;
  value: string;
};

type SelectFilterHandler = (filterKey: FilterByKey, filter: string) => void;

type MarketPlaceCtxType = {
  defaultSneakers: GallerySneaker[] | undefined;
  filterSneakers: GallerySneaker[] | undefined;
  brands: string[] | undefined;
  filterItemGroup: FilterItem[];
  numFilters: number;
  clearFilters: () => void;
  isFilterSelected: (filterVal: string) => boolean;
  updateFilterSneakers: (sneakersToShow: GallerySneaker[]) => void;
  onSelectFilter: SelectFilterHandler;
};

const INIT_CTX: MarketPlaceCtxType = {
  defaultSneakers: undefined,
  filterSneakers: undefined,
  brands: undefined,
  filterItemGroup: [],
  numFilters: 0,
  clearFilters: () => {
    throw new Error('Must override!');
  },
  updateFilterSneakers: () => {
    throw new Error('Must override!');
  },
  onSelectFilter: () => {
    throw new Error('Must override!');
  },
  isFilterSelected: () => {
    throw new Error('Must override!');
  },
};

export const MarketPlaceCtx = createContext(INIT_CTX);

export const useMarketPlaceCtx = () => useContext(MarketPlaceCtx);

const getSneakersBySizes = async (sizes: number[], sellerId: number) => {
  const nestedSneakers = await Promise.all(
    sizes.map((size) => ListedSneakerControllerInstance.getGallerySneakersBySize(sellerId, size))
  );

  const flattenedSneakers = _.flatten(nestedSneakers);
  const uniqSneakersByNameColorway = _.uniqBy(flattenedSneakers, (sneaker) => sneaker.name + sneaker.colorway);

  return uniqSneakersByNameColorway;
};

const filterByBrands = (sneakers: GallerySneaker[], brands: string[]) =>
  sneakers.filter((s) => brands.includes(s.brand));

const MarketPlaceProvider = (props: { children: ReactNode; listedSneakerController: ListedSneakerController }) => {
  const [defaultSneakers, setDefaultSneakers] = useState<GallerySneaker[]>();
  const [filterSneakers, setFilterSneakers] = useState<GallerySneaker[]>();
  const [brands, setBrands] = useState<string[]>();

  const [filterItemGroup, setFilterItemGroup] = useState<FilterItem[]>([]);

  const { currentUser, signedIn } = useAuth();

  const updateFilterSneakers = useCallback((sneakers: GallerySneaker[]) => setFilterSneakers(sneakers), []);

  useEffect(() => {
    (async () => {
      let gallerySneakers: GallerySneaker[] = [];

      // if the user is not logged in, then render all gallery sneakers
      if (!signedIn) gallerySneakers = await props.listedSneakerController.getGallerySneakers(-1);
      // otherwise hide the sneakers the seller has listed
      else if (currentUser) gallerySneakers = await props.listedSneakerController.getGallerySneakers(currentUser.id);

      setDefaultSneakers(gallerySneakers);
      setFilterSneakers(gallerySneakers);

      setBrands(await HelperInfoControllerInstance.getBrands());
    })();
  }, [props.listedSneakerController, signedIn, currentUser]);

  const filterHandler = useCallback(async () => {
    if (!defaultSneakers) return;

    const sizes = filterItemGroup.filter((f) => f.type === 'size').map((item) => Number(item.value));
    const brands = filterItemGroup.filter((f) => f.type === 'brand').map((item) => item.value);
    const userId = currentUser ? currentUser.id : -1;

    // filter by brands and sizes
    if (!_.isEmpty(sizes) && !_.isEmpty(brands)) {
      const sneakersBySizes = await getSneakersBySizes(sizes, userId);
      const sneakersBySizesAndBrands = filterByBrands(sneakersBySizes, brands);
      updateFilterSneakers(sneakersBySizesAndBrands);
      // filter by sizes only
    } else if (!_.isEmpty(sizes)) {
      const sneakersBySizes = await getSneakersBySizes(sizes, userId);
      updateFilterSneakers(sneakersBySizes);
      // filter by brands only
    } else if (!_.isEmpty(brands)) {
      const sneakersByBrands = filterByBrands(defaultSneakers, brands);
      updateFilterSneakers(sneakersByBrands);
      // reset the states
    } else updateFilterSneakers(defaultSneakers);
  }, [currentUser, defaultSneakers, filterItemGroup, updateFilterSneakers]);

  useEffect(() => {
    filterHandler();
  }, [filterHandler]);

  const clearFilters = () => setFilterItemGroup([]);

  const isFilterSelected = (selectedVal: string) => filterItemGroup.findIndex((f) => f.value === selectedVal) > -1;

  const onSelectFilter = (filterKey: FilterByKey, filter: string) => {
    // unselect the filter if it is already selected
    if (isFilterSelected(filter)) setFilterItemGroup(filterItemGroup.filter((f) => f.value !== filter));
    // otherwise add it to the selected filterItemGroup
    else setFilterItemGroup([...filterItemGroup, { type: filterKey, value: String(filter) }]);
  };

  return (
    <MarketPlaceCtx.Provider
      value={{
        defaultSneakers,
        filterSneakers,
        filterItemGroup,
        brands,
        numFilters: filterItemGroup.length,
        clearFilters,
        updateFilterSneakers,
        isFilterSelected,
        onSelectFilter,
      }}
    >
      {props.children}
    </MarketPlaceCtx.Provider>
  );
};

export default MarketPlaceProvider;
