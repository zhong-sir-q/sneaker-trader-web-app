import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import { concatPaths } from 'utils/formatApiEndpoint';

import { HOME } from 'routes';

import BuySneakerPageContainer from 'containers/BuySneakerPageContainer';
import ViewSellersListContainer from 'containers/ViewSellersListContainer';

import { formatSneakerPathName } from 'utils/utils';

type ListedSneakerRoutesType = {
  listedSneakerRoutes: JSX.Element[];
};

const INIT_CTX: ListedSneakerRoutesType = {
  listedSneakerRoutes: [],
};

const ListedSneakerRoutes = createContext(INIT_CTX);

export const useListedSneakerRoutes = () => useContext(ListedSneakerRoutes);

const ListedSneakerRoutesProvider = (props: { children: ReactNode }) => {
  const [listedSneakerRoutes, setListedSneakerRoutes] = useState<JSX.Element[]>([]);

  const renderListedSneakerRoutes = async () => {
    const sneakers = await ListedSneakerControllerInstance.getAllListedSneakers();

    // prevent duplicate routes from rendering
    // because there can be multiple sneakers with the same
    // name, but each of them can have a different size
    const seenPaths: Set<string> = new Set();

    return sneakers.map(({ name, colorway, size }, idx) => {
      const path = formatSneakerPathName(name, colorway);

      const routes = (
        <React.Fragment key={idx}>
          <Route path={concatPaths(HOME, path, size)} component={ViewSellersListContainer} />
          {!seenPaths.has(path) ? (
            <Route exact path={concatPaths(HOME, path)} component={BuySneakerPageContainer} />
          ) : null}
        </React.Fragment>
      );

      seenPaths.add(path);

      return routes;
    });
  };

  useEffect(() => {
    (async () => setListedSneakerRoutes(await renderListedSneakerRoutes()))();
  }, []);

  return <ListedSneakerRoutes.Provider value={{ listedSneakerRoutes }}>{props.children}</ListedSneakerRoutes.Provider>;
};

export default ListedSneakerRoutesProvider;
