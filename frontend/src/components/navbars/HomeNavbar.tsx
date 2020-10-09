import React, { useState } from 'react';
import { Navbar, Nav, NavItem, Collapse, NavbarToggler } from 'reactstrap';

import { Link } from 'react-router-dom';

import styled from 'styled-components';

import logo from 'assets/img/logo_transparent_background.png';
import SneakerSearchBar from 'components/SneakerSearchBar';

import { signOut } from 'utils/auth';
import { useAuth } from 'providers/AuthProvider';

import { ADMIN, DASHBOARD, AUTH, SIGNIN, HOME } from 'routes';
import { useHomePageCtx } from 'providers/marketplace/HomePageCtxProvider';

const SearchBarWrapper = styled.div`
  padding: 0.5rem 0.7rem;

  @media (min-width: 680px) {
    width: 550px;
  }

  @media (min-width: 991px) {
    margin: auto;
  }
`;

const StyledNavbar = styled(Navbar)`
  @media (min-width: 991px) {
    padding-left: 3.5rem;
    padding-right: 3.5rem;
  }
`;

const HomeNavbar = () => {
  const [openNav, setOpenNav] = useState(false);

  const { signedIn } = useAuth();
  const { defaultSneakers } = useHomePageCtx()

  const toggleNav = () => setOpenNav(!openNav);

  return (
    <StyledNavbar expand='lg'>
      <div className='navbar-wrapper'>
        <div className='navbar-toggle'>
          <NavbarToggler onClick={toggleNav}>
            <span style={{ backgroundColor: '#888' }} className='navbar-toggler-bar bar1' />
            <span style={{ backgroundColor: '#888' }} className='navbar-toggler-bar bar2' />
            <span style={{ backgroundColor: '#888' }} className='navbar-toggler-bar bar3' />
          </NavbarToggler>
        </div>
        <Link to={HOME} style={{ width: '120px' }}>
          <img src={logo} alt='sneakertrader-logo' />
        </Link>
      </div>

      <Collapse isOpen={openNav} navbar>
        <SearchBarWrapper>
          <SneakerSearchBar items={defaultSneakers || []} />
        </SearchBarWrapper>

        <Nav navbar>
          {signedIn && (
            <NavItem>
              <Link style={{ color: 'black' }} to={ADMIN + DASHBOARD} className='nav-link'>
                <i className='now-ui-icons design_bullet-list-67' /> Dashboard
              </Link>
            </NavItem>
          )}

          {signedIn ? (
            <NavItem style={{ cursor: 'pointer' }} onClick={() => signOut()}>
              <p className='nav-link'>
                <i className='now-ui-icons users_circle-08' />
                Logout
              </p>
            </NavItem>
          ) : (
            <NavItem>
              <Link className='nav-link' style={{ color: 'black' }} to={AUTH + SIGNIN}>
                <i className='now-ui-icons users_circle-08' /> Login
              </Link>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </StyledNavbar>
  );
};

export default HomeNavbar;
