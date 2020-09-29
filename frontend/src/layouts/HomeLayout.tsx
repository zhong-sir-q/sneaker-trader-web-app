import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

import HomeNavbar from 'components/navbars/HomeNavbar';
import Footer from 'components/Footer';
import SellersList from 'pages/SellersList';
import BuySneakerPage from 'pages/BuySneakerPage';

// import { getAllListedSneakers } from 'api/api';
import { formatSneakerPathName } from 'utils/utils';

import { homeRoutes } from 'routes';
import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';

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
          <Route exact path={`/${path}/${size}`} component={SellersList} />
          {!seenPaths.has(path) ? <Route exact path={`/${path}`} component={BuySneakerPage} /> : undefined}
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
      {buySneakerRoutes}
      {renderHomeRoutes()}
      <Footer fluid default={false} />
    </React.Fragment>
  );
};

export default HomeLayout;
