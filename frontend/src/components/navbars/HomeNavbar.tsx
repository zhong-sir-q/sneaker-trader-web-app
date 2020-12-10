import React, { useState } from 'react';
import { Navbar, Nav, NavItem, Collapse, NavbarToggler } from 'reactstrap';

import { Link, useHistory } from 'react-router-dom';

import styled from 'styled-components';

import { signOut } from 'utils/auth';

import { ADMIN, DASHBOARD, AUTH, SIGNIN, HOME } from 'routes';

import logo from 'assets/img/logo_transparent_background.png';
import { useUserRanking } from 'providers/UserRankingProvider';
import { MD_WIDTH } from 'const/variables';

import useOpenCloseComp from 'hooks/useOpenCloseComp';

import FiltersDrawer from 'components/marketplace/filters/FiltersDrawer';
import SneakerSearchBar from 'components/SneakerSearchBar';

import { FilterList, Cancel, Search } from '@material-ui/icons';

import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';
import { useAuth } from 'providers/AuthProvider';

import { SearchBarSneaker } from '../../../../shared';

import redirectBuySneakerPage from 'utils/redirectBuySneakerPage';
import _ from 'lodash';

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

  const { defaultSneakers, brands } = useMarketPlaceCtx();

  const toggleNav = () => setOpenNav(!openNav);

  const { onOpenLeaderBoard } = useUserRanking();
  const filterDrawerHook = useOpenCloseComp();
  const mobileSearchbarHook = useOpenCloseComp();

  const { signedIn } = useAuth();

  const history = useHistory();

  const navigateBuySneakerPage = (sneaker: SearchBarSneaker) =>
    redirectBuySneakerPage(history, sneaker.name, sneaker.colorway);

  const sizeFilters = _.range(3, 15, 0.5).map((v) => String(v));

  return (
    <StyledNavbar expand='lg'>
      <NavbarWrapper className='navbar-wrapper w-full'>
        <div className='navbar-toggle'>
          <NavbarToggler onClick={toggleNav}>
            <span style={{ backgroundColor: '#888' }} className='navbar-toggler-bar bar1' />
            <span style={{ backgroundColor: '#888' }} className='navbar-toggler-bar bar2' />
            <span style={{ backgroundColor: '#888' }} className='navbar-toggler-bar bar3' />
          </NavbarToggler>
        </div>

        {mobileSearchbarHook.open ? (
          <React.Fragment>
            <FiltersDrawer
              open={filterDrawerHook.open}
              onClose={filterDrawerHook.onClose}
              brandFilters={brands || []}
              sizeFilters={sizeFilters || []}
            />
            <SneakerSearchBar
              width='100%'
              sneakers={defaultSneakers || []}
              onChooseSneaker={navigateBuySneakerPage}
              focusOnMount
            />
            <FilterListIconWrapper onClick={filterDrawerHook.onOpen}>
              <StyledFilterListIcon />
            </FilterListIconWrapper>

            <Cancel onClick={mobileSearchbarHook.onClose} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link to={HOME}>
              {/* same height as the searchbar so it does not stretch */}
              <img style={{ height: '44px' }} src={logo} alt='sneakertrader-logo' />
            </Link>

            <Search onClick={mobileSearchbarHook.onOpen} />
          </React.Fragment>
        )}
      </NavbarWrapper>

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

const StyledFilterListIcon = styled(FilterList)`
  position: absolute;
  right: 10px;
  top: -12px;
`;

const SearchBarWrapper = styled.div``;

const FilterListIconWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const NavbarWrapper = styled.div`
  justify-content: space-between;
`;

export default HomeNavbar;
