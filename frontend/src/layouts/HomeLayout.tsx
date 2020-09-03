import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, NavItem, NavbarBrand } from 'reactstrap';
import { Link, Route } from 'react-router-dom';

import Footer from 'components/Footer';
import BuySneakerPage from 'pages/BuySneakerPage';

import { getProducts } from 'api/api';
import { formatSneakerPathName } from 'utils/utils';

import { Sneaker } from '../../../shared';
import { AUTH, SIGNIN, HomeRoute, homeRoutes } from 'routes';

// TODO: move this to the navbars folder
const HomeNavbar = () => {
  return (
    <Navbar expand='lg'>
      <Container fluid>
        <NavbarBrand>
          <Link style={{ color: 'black' }} to='/'>
            Sneaker Trader
          </Link>
        </NavbarBrand>
        <Nav className='ml-auto'>
          {/* <NavItem>
            TODO: this should only be rendered when the user is logged in
            <Link to={ADMIN + DASHBOARD} className='nav-link'>
              <i className='now-ui-icons design_bullet-list-67' /> Dashboard
            </Link>
          </NavItem> */}
          {/* TODO: when the user is signed in this should be log out */}
          <NavItem>
            <Link style={{ color: 'black' }} to={AUTH + SIGNIN}>
              <i style={{ verticalAlign: 'middle', marginRight: '3px' }} className='now-ui-icons users_circle-08' /> Login
            </Link>
          </NavItem>
        </Nav>
      </Container>
    </Navbar>
  );
};

const HomeLayout = () => {
  const [buySneakerRoutes, setBuySneakerRoutes] = useState<JSX.Element[]>([]);

  const renderBuySneakerRoutes = async () => {
    const sneakers: Sneaker[] = await getProducts();

    return sneakers.map((s) => <Route path={`/${formatSneakerPathName(s.colorWay + ' ' + s.name)}`} component={BuySneakerPage} />);
  };

  useEffect(() => {
    (async () => setBuySneakerRoutes(await renderBuySneakerRoutes()))();
  }, []);

  const renderRoutes = (routes: HomeRoute[]) => routes.map(({ path, component }) => <Route path={path} component={component} />);

  return (
    <React.Fragment>
      <HomeNavbar />
      {buySneakerRoutes}
      {renderRoutes(homeRoutes)}
      <Footer fluid default={false} />
    </React.Fragment>
  );
};

export default HomeLayout;
