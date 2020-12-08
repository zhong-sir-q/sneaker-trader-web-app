import React, { useState } from 'react';
import { Navbar, Nav, NavItem, Collapse, NavbarToggler } from 'reactstrap';

import { Link } from 'react-router-dom';

import styled from 'styled-components';


import { signOut } from 'utils/auth';
import { useAuth } from 'providers/AuthProvider';

import { ADMIN, DASHBOARD, AUTH, SIGNIN, HOME } from 'routes';

import logo from 'assets/img/logo_transparent_background.png';
import { useUserRanking } from 'providers/UserRankingProvider';
import { MD_WIDTH } from 'const/variables';


const StyledNavbar = styled(Navbar)`
  position: fixed;
  z-index: 999;
  /* this needs to be transparent at the marketplace because of the Hero card */
  background-color: white;
  left: 0;
  right: 0;

  @media (min-width: ${MD_WIDTH}) {
    padding-left: 3.5rem;
    padding-right: 3.5rem;
  }
`;

// NOTE: some navbar specific styles are overriden in sneakertrader.css
const HomeNavbar = () => {
  const [openNav, setOpenNav] = useState(false);

  const toggleNav = () => setOpenNav(!openNav);

  const { onOpenLeaderBoard } = useUserRanking();

  const { signedIn } = useAuth();

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
        <StyledNav navbar>
          <NavItem>
            <div onClick={onOpenLeaderBoard} className='nav-link pointer'>
              Leaderboard
            </div>
          </NavItem>

          {signedIn && (
            <NavItem data-testid='homebar-dashboard-link'>
              <Link to={ADMIN + DASHBOARD} className='nav-link'>
                Dashboard
              </Link>
            </NavItem>
          )}

          {signedIn ? (
            <NavItem onClick={() => signOut()}>
              <Link to={HOME} className='nav-link'>
                Logout
              </Link>
            </NavItem>
          ) : (
            <NavItem>
              <Link className='nav-link' to={AUTH + SIGNIN}>
                <i className='now-ui-icons users_circle-08' /> Login
              </Link>
            </NavItem>
          )}
        </StyledNav>
      </Collapse>
    </StyledNavbar>
  );
};

const StyledNav = styled(Nav)`
  margin-left: auto;
  white-space: nowrap;
  font-size: 1.25rem;
  font-weight: 500;
  text-transform: capitalize;
  /* the color will be white in the market place */
  color: black;
`;

export default HomeNavbar;
