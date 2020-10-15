import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import { concatPaths } from 'api/formatApiEndpoint';
import Footer from 'components/Footer';
import HomeNavbar from 'components/navbars/HomeNavbar';
import BuySneakerPageContainer from 'containers/BuySneakerPageContainer';
import ViewSellersListContainer from 'containers/ViewSellersListContainer';
import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { MARKET_PLACE, homeRoutes } from 'routes';
import { formatSneakerPathName } from 'utils/utils';

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
            <Route exact path={concatPaths(MARKET_PLACE, path)} component={BuySneakerPageContainer} />
          ) : undefined}
          <Route path={concatPaths(MARKET_PLACE, path, size)} component={ViewSellersListContainer} />
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
    homeRoutes.map(({ path, layout, component }) => (
      <Route exact path={layout + path} component={component} key={path} />
    ));

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
