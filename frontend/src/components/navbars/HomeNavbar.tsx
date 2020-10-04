import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';

import { ADMIN, DASHBOARD, AUTH, SIGNIN, HOME } from 'routes';

import { signOut } from 'utils/auth';
import { useAuth } from 'providers/AuthProvider';

const HomeNavbar = () => {
  const { signedIn } = useAuth();

  return (
    <Navbar style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }} color='light' light>
      <NavbarBrand style={{ color: 'black' }} href={HOME}>
        Sneaker Trader
      </NavbarBrand>
      <Nav style={{ alignItems: 'center' }} className='ml-auto'>
        {signedIn && (
          <NavItem>
            <Link style={{ color: 'black' }} to={ADMIN + DASHBOARD} className='nav-link'>
              <i
                style={{ verticalAlign: 'middle', marginRight: '3px' }}
                className='now-ui-icons design_bullet-list-67'
              />{' '}
              Dashboard
            </Link>
          </NavItem>
        )}

        {signedIn ? (
          <NavItem style={{ cursor: 'pointer' }} onClick={() => signOut()}>
            <i style={{ verticalAlign: 'middle', marginRight: '3px' }} className='now-ui-icons users_circle-08' />{' '}
            Logout
          </NavItem>
        ) : (
          <NavItem>
            <Link style={{ color: 'black' }} to={AUTH + SIGNIN}>
              <i style={{ verticalAlign: 'middle', marginRight: '3px' }} className='now-ui-icons users_circle-08' />{' '}
              Login
            </Link>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
};

export default HomeNavbar;
