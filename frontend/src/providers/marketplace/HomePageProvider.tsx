import React, { createContext, ReactNode, useContext, useState, useEffect, useCallback } from 'react';

import { useAuth } from 'providers/AuthProvider';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import HelperInfoControllerInstance from 'api/controllers/HelperInfoController';

import { GallerySneaker } from '../../../../shared';

type HomePageCtxType = {
  defaultSneakers: GallerySneaker[] | undefined;
  filterSneakers: GallerySneaker[] | undefined;
  brands: string[] | undefined;
  updateFilterSneakers: (sneakersToShow: GallerySneaker[]) => void;
};

const INIT_CTX: HomePageCtxType = {
  defaultSneakers: undefined,
  filterSneakers: undefined,
  brands: undefined,
  updateFilterSneakers: () => {
    throw new Error('Must override!');
  },
};

const HomePageCtx = createContext(INIT_CTX);

export const useHomePageCtx = () => useContext(HomePageCtx);

const HomePageProvider = (props: { children: ReactNode }) => {
  const [defaultSneakers, setDefaultSneakers] = useState<GallerySneaker[]>();
  const [filterSneakers, setFilterSneakers] = useState<GallerySneaker[]>();
  const [brands, setBrands] = useState<string[]>();

  const { currentUser, signedIn } = useAuth();

  const updateFilterSneakers = useCallback((sneakers: GallerySneaker[]) => setFilterSneakers(sneakers), []);

  useEffect(() => {
    (async () => {
      let gallerySneakers: GallerySneaker[] = [];

      // if the user is not logged in, then render all gallery sneakers
      if (!signedIn) gallerySneakers = await ListedSneakerControllerInstance.getGallerySneakers(-1);
      else if (currentUser) gallerySneakers = await ListedSneakerControllerInstance.getGallerySneakers(currentUser.id);

      setDefaultSneakers(gallerySneakers);
      setFilterSneakers(gallerySneakers);

      setBrands(await HelperInfoControllerInstance.getBrands());
    })();
  }, [signedIn, currentUser]);

  return (
    <HomePageCtx.Provider value={{ defaultSneakers, filterSneakers, brands, updateFilterSneakers }}>
      {props.children}
    </HomePageCtx.Provider>
  );
};

export default HomePageProvider;
