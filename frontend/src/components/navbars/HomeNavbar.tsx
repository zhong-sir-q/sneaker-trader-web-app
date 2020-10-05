import React, { useState } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, Collapse, Container, NavbarToggler } from 'reactstrap';
import { Link } from 'react-router-dom';

import { ADMIN, DASHBOARD, AUTH, SIGNIN, HOME } from 'routes';

import { signOut } from 'utils/auth';
import { useAuth } from 'providers/AuthProvider';

import SneakerSearchBar, { mockSneakerSearchOptions } from 'components/SneakerSearchBar';
import styled from 'styled-components';

const IconBar = styled.span`
  display: block;
  width: 22px;
  height: 2px;
  border-radius: 1px;
  margin-top: 4px;
  background-color: #888;
`;

const StyledNavItem = styled(NavItem)`
  @media (min-width: 991px) {
    margin: auto;
  }
`;

const HomeNavbar = () => {
  const { signedIn } = useAuth();

  const [openNav, setOpenNav] = useState(false);

  const toggleNav = () => setOpenNav(!openNav);

  return (
    <Navbar expand='lg' style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}>
      <Container fluid>
        <div className='navbar-wrapper'>
          <div className='navbar-toggle'>
            <NavbarToggler onClick={toggleNav}>
              <IconBar />
              <IconBar />
              <IconBar />
            </NavbarToggler>
          </div>
          <NavbarBrand style={{ color: 'black' }} href={HOME}>
            Sneaker Trader
          </NavbarBrand>
        </div>

        <Collapse isOpen={openNav} navbar>
          <Nav className='ml-auto' navbar>
            <StyledNavItem>
              <SneakerSearchBar items={mockSneakerSearchOptions} />
            </StyledNavItem>
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
                <Link style={{ color: 'black' }} to={AUTH + SIGNIN}>
                  <i style={{ verticalAlign: 'middle', marginRight: '3px' }} className='now-ui-icons users_circle-08' />{' '}
                  Login
                </Link>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default HomeNavbar;
