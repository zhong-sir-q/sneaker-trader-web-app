import React from 'react';
import { Route, useLocation } from 'react-router-dom';

import Footer from 'components/Footer';
import HomeNavbar from 'components/navbars/HomeNavbar';

import { homeRoutes } from 'routes';
import { useListedSneakerRoutes } from 'providers/ListedSneakerRoutesProvider';

import styled from 'styled-components';
import ScrollToTopOnRouteChange from 'components/ScrollToTopOnRouteChange';

const HomeLayout = () => {
  const { listedSneakerRoutes } = useListedSneakerRoutes();

  const renderHomeRoutes = () =>
    homeRoutes.map(({ path, layout, component }) => (
      <Route exact path={layout === '/' ? path : layout + path} component={component} key={path} />
    ));

  const location = useLocation();

  return (
    <React.Fragment>
      <ScrollToTopOnRouteChange>
        <HomeNavbar />
        {/* do not render TopGradient at market place due to the Hero Card */}
        {location.pathname !== '/' ? <TopGradient /> : null}
        {renderHomeRoutes()}
        {listedSneakerRoutes}
        <Footer fluid default={false} />
      </ScrollToTopOnRouteChange>
    </React.Fragment>
  );
};

const TopGradient = styled.div`
  height: 12vh;
  background: linear-gradient(#e5e5e5, #f5f5f5, #fff, #fff);
  background-color: #fff;

  @media (max-height: 768px) {
    height: 14vh;
  }

  @media (max-height: 428px) {
    height: 15vh;
  }
`;

export default HomeLayout;
