import React from 'react';
import { Route, useLocation } from 'react-router-dom';

import Footer from 'components/Footer';
import HomeNavbar from 'components/navbars/HomeNavbar';

import { homeRoutes } from 'routes';
import { useListedSneakerRoutes } from 'providers/ListedSneakerRoutesProvider';

import styled from 'styled-components';

const HomeLayout = () => {
  const { listedSneakerRoutes } = useListedSneakerRoutes();

  const renderHomeRoutes = () =>
    homeRoutes.map(({ path, layout, component }) => (
      <Route exact path={layout === '/' ? path : layout + path} component={component} key={path} />
    ));

  const location = useLocation();

  return (
    <React.Fragment>
      <HomeNavbar />
      {location.pathname !== '/' ? <TopGradient /> : null}
      {renderHomeRoutes()}
      {listedSneakerRoutes}
      <Footer fluid default={false} />
    </React.Fragment>
  );
};

const TopGradient = styled.div`
  height: 11vh;
  background: linear-gradient(#e5e5e5, #f5f5f5, #fff, #fff);
  background-color: #fff;

  @media (max-width: 768px) {
    height: 13vh;
  }

  @media (max-width: 428px) {
    height: 15vh;
  }
`;

export default HomeLayout;
