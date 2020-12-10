import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

import { ListedSneakerController } from 'api/controllers/ListedSneakerController';
import { concatPaths } from 'utils/formatApiEndpoint';

import { HOME } from 'routes';

import BuySneakerPageContainer from 'containers/BuySneakerPageContainer';
import ViewSellersListContainer from 'containers/ViewSellersListContainer';

import { formatSneakerPathName } from 'utils/utils';
import { GetListedSneaker } from '../../../shared';

type ListedSneakerRoutesType = {
  listedSneakerRoutes: JSX.Element[];
};

const INIT_CTX: ListedSneakerRoutesType = {
  listedSneakerRoutes: [],
};

export const ListedSneakerRoutesCtx = createContext(INIT_CTX);

export const useListedSneakerRoutes = () => useContext(ListedSneakerRoutesCtx);

export const renderListedSneakerRoutes = (listedSneakers: GetListedSneaker[]) => {
  // prevent duplicate routes from rendering because there can
  // be multiple sneakers with the same name, but each of them
  // can have a different size and we only want
  // to render those sneakers using the name and colorway
  const seenPaths: Set<string> = new Set();

  return listedSneakers.map(({ name, colorway, size }, idx) => {
    const path = formatSneakerPathName(name, colorway);

    const routes = (
      <React.Fragment key={idx}>
        <Route exact path={concatPaths(HOME, path, size)} component={ViewSellersListContainer} />
        {!seenPaths.has(path) ? (
          <Route exact path={concatPaths(HOME, path)} component={BuySneakerPageContainer} />
        ) : null}
      </React.Fragment>
    );

    seenPaths.add(path);

    return routes;
  });
};

const ListedSneakerRoutesProvider = (props: { children: ReactNode, listedSneakerController: ListedSneakerController }) => {
  const [listedSneakerRoutes, setListedSneakerRoutes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    (async () => {
      const sneakers = await props.listedSneakerController.getAllListedSneakers();
      setListedSneakerRoutes(renderListedSneakerRoutes(sneakers));
    })();
  }, [props.listedSneakerController]);

  return (
    <ListedSneakerRoutesCtx.Provider value={{ listedSneakerRoutes }}>{props.children}</ListedSneakerRoutesCtx.Provider>
  );
};

export default ListedSneakerRoutesProvider;
