import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import Footer from 'components/Footer';
import HomeNavbar from 'components/navbars/HomeNavbar';

import { homeRoutes, HOME } from 'routes';
import { useListedSneakerRoutes } from 'providers/ListedSneakerRoutesProvider';

const HomeLayout = () => {
  const { listedSneakerRoutes } = useListedSneakerRoutes();

  const renderHomeRoutes = () =>
    homeRoutes.map(({ path, layout, component }) => (
      <Route exact path={layout === '/' ? path : layout + path} component={component} key={path} />
    ));

  return (
    <React.Fragment>
      <HomeNavbar />
      {renderHomeRoutes()}
      {listedSneakerRoutes}
      <Footer fluid default={false} />
      {/* If suffix path does not exist, then redirect to the base path */}
      <Redirect from={HOME} to={HOME} />
    </React.Fragment>
  );
};

export default HomeLayout;
