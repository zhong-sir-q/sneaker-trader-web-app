import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavItem, NavbarBrand } from 'reactstrap';
import { Link, Route, useHistory } from 'react-router-dom';

import Footer from 'components/Footer';
import SellersList from 'pages/SellersList';
import BuySneakerPage from 'pages/BuySneakerPage';

import { getAllListedProducts } from 'api/api';
import { formatSneakerPathName } from 'utils/utils';

import { Sneaker } from '../../../shared';
import { AUTH, SIGNIN, HomeRoute, homeRoutes, ADMIN, DASHBOARD } from 'routes';
import { fetchCognitoUser, signOut } from 'utils/auth';

// TODO: move this to the navbars folder
const HomeNavbar = () => {
  const [signedIn, setSignedIn] = useState(false);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const cognitoUser = await fetchCognitoUser();
      // not signed in
      if (!cognitoUser) return;

      setSignedIn(true);
    })();
  }, []);


  return (
    <Navbar color='light' light>
      <NavbarBrand style={{ color: 'black' }} href='/'>
        Sneaker Trader
      </NavbarBrand>
      <Nav style={{ alignItems: 'center' }} className='ml-auto'>
        {signedIn && (
          <NavItem>
            <Link style={{ color: 'black' }} to={ADMIN + DASHBOARD} className='nav-link'>
              <i style={{ verticalAlign: 'middle', marginRight: '3px' }} className='now-ui-icons design_bullet-list-67' /> Dashboard
            </Link>
          </NavItem>
        )}

        {signedIn ? (
          <NavItem
            style={{ cursor: 'pointer' }}
            onClick={() => {
              signOut(history);
              setSignedIn(false);
            }}
          >
            <i style={{ verticalAlign: 'middle', marginRight: '3px' }} className='now-ui-icons users_circle-08' /> Logout
          </NavItem>
        ) : (
            <NavItem>
              <Link style={{ color: 'black' }} to={AUTH + SIGNIN}>
                <i style={{ verticalAlign: 'middle', marginRight: '3px' }} className='now-ui-icons users_circle-08' /> Login
            </Link>
            </NavItem>
          )}
      </Nav>
    </Navbar>
  );
};

const HomeLayout = () => {
  const [buySneakerRoutes, setBuySneakerRoutes] = useState<JSX.Element[]>([]);

  const renderBuySneakerRoutes = async () => {
    const sneakers: Sneaker[] = await getAllListedProducts();
    // prevent duplicate routes from rendering
    const seenPaths: Set<string> = new Set()

    return sneakers.map(({ name, colorway, size }, idx) => {
      const path = formatSneakerPathName(name, colorway)

      const routes = (<React.Fragment key={idx}>
        <Route exact path={`/${path}/${size}`} component={SellersList} />
        {!seenPaths.has(path) ? <Route exact path={`/${path}`} component={BuySneakerPage} /> : undefined}
      </React.Fragment>)

      seenPaths.add(path)

      return routes
    })
  };

  useEffect(() => {
    (async () => setBuySneakerRoutes(await renderBuySneakerRoutes()))();
  }, []);

  const renderRoutes = (routes: HomeRoute[]) => routes.map(({ path, component }) => <Route exact path={path} component={component} key={path} />);

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
