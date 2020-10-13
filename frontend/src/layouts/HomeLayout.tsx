import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

import HomeNavbar from 'components/navbars/HomeNavbar';
import Footer from 'components/Footer';
import ViewSellersList from 'pages/ViewSellersList';
import BuySneakerPage from 'pages/BuySneakerPage';

import { formatSneakerPathName } from 'utils/utils';

import { homeRoutes, HOME } from 'routes';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import { concatPaths } from 'api/formatApiEndpoint';
import BuySneakerPageProvider from 'providers/marketplace/BuySneakerPageProvider';
import ViewSellersListProvider from 'providers/marketplace/ViewSellersListProvider';

const HomeLayout = () => {
  const [buySneakerRoutes, setBuySneakerRoutes] = useState<JSX.Element[]>([]);

  const renderBuySneakerRoutes = async () => {
    const sneakers = await ListedSneakerControllerInstance.getAllListedSneakers();

    // prevent duplicate routes from rendering
    // because there can be multiple sneakers with the same
    // name, but each of them can have a different size
    const seenPaths: Set<string> = new Set();

    return sneakers.map(({ name, colorway, size }, idx) => {
      const path = formatSneakerPathName(name, colorway);

      const routes = (
        <React.Fragment key={idx}>
          {!seenPaths.has(path) ? (
            <Route
              exact
              path={concatPaths(HOME, path)}
              component={() => (
                <BuySneakerPageProvider>
                  <BuySneakerPage />
                </BuySneakerPageProvider>
              )}
            />
          ) : undefined}
          <Route
            path={concatPaths(HOME, path, size)}
            component={() => (
              <ViewSellersListProvider>
                <ViewSellersList />
              </ViewSellersListProvider>
            )}
          />
        </React.Fragment>
      );

      seenPaths.add(path);

      return routes;
    });
  };

  useEffect(() => {
    (async () => setBuySneakerRoutes(await renderBuySneakerRoutes()))();
  }, []);

  const renderHomeRoutes = () =>
    homeRoutes.map(({ path, component }) => <Route exact path={path} component={component} key={path} />);

  return (
    <React.Fragment>
      <HomeNavbar />
      {renderHomeRoutes()}
      {buySneakerRoutes}
      <Footer fluid default={false} />
    </React.Fragment>
  );
};

export default HomeLayout;
