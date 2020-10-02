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

const HomeLayout = () => {
  const [buySneakerRoutes, setBuySneakerRoutes] = useState<JSX.Element[]>([]);

  const renderBuySneakerRoutes = async () => {
    const sneakers = await ListedSneakerControllerInstance.getAllListedSneakers();

    // prevent duplicate routes from rendering
    const seenPaths: Set<string> = new Set();

    return sneakers.map(({ name, colorway, size }, idx) => {
      const path = formatSneakerPathName(name, colorway);

      const routes = (
        <React.Fragment key={idx}>
          {!seenPaths.has(path) ? <Route exact path={concatPaths(HOME, path)} component={BuySneakerPage} /> : undefined}
          <Route path={concatPaths(HOME, path, size)} component={ViewSellersList} />
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
