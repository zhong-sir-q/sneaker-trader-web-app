import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavItem, Collapse, NavbarToggler } from 'reactstrap';

import { Link } from 'react-router-dom';

import styled from 'styled-components';

import SneakerSearchBar from 'components/SneakerSearchBar';

import { signOut } from 'utils/auth';
import { useAuth } from 'providers/AuthProvider';

import { ADMIN, DASHBOARD, AUTH, SIGNIN, MARKET_PLACE } from 'routes';
import { useHomePageCtx } from 'providers/marketplace/MarketPlaceProvider';
import { UserRankingRow } from '../../../../shared';
import UserControllerInstance from 'api/controllers/UserController';

import { UserRankingLeaderBoardDialog } from 'components/UserRankingLeaderBoard';

import logo from 'assets/img/logo_transparent_background.png';
import useOpenCloseComp from 'hooks/useOpenCloseComp';

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

  const toggleNav = () => setOpenNav(!openNav);

  const openCloseRankingDialog = useOpenCloseComp();

  const openUserLeaderBoard = openCloseRankingDialog.open;
  const onOpenUserLeaderBoard = openCloseRankingDialog.onOpen;
  const onCloseUserLeaderBoard = openCloseRankingDialog.onClose;

  const [rankingRows, setRankingRows] = useState<UserRankingRow[]>([]);

  useEffect(() => {
    (async () => {
      const rows = await UserControllerInstance.getAllUserRankingPoints();
      setRankingRows(rows);
    })();
  }, []);

  const { signedIn } = useAuth();
  const { defaultSneakers } = useHomePageCtx();

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
        <Link to={MARKET_PLACE} style={{ width: '120px' }}>
          <img src={logo} alt='sneakertrader-logo' />
        </Link>
      </div>

      <Collapse isOpen={openNav} navbar>
        <SearchBarWrapper>
          <SneakerSearchBar items={defaultSneakers || []} />
        </SearchBarWrapper>

        <Nav navbar>
          <NavItem>
            <Link
              type='button'
              style={{ color: 'black' }}
              onClick={onOpenUserLeaderBoard}
              to={MARKET_PLACE}
              className='nav-link'
            >
              Leaderboard
            </Link>
          </NavItem>

          {signedIn && (
            <NavItem>
              <Link style={{ color: 'black' }} to={ADMIN + DASHBOARD} className='nav-link'>
                Dashboard
              </Link>
            </NavItem>
          )}

          {signedIn ? (
            <NavItem style={{ cursor: 'pointer' }} onClick={() => signOut()}>
              <Link style={{ color: 'black' }} to={MARKET_PLACE} className='nav-link'>
                Logout
              </Link>
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

      <UserRankingLeaderBoardDialog
        isDialogOpen={openUserLeaderBoard}
        closeDialog={onCloseUserLeaderBoard}
        rankings={rankingRows}
      />
    </StyledNavbar>
  );
};

export default HomeNavbar;
