import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavItem, Collapse, NavbarToggler } from 'reactstrap';

import { Link, useHistory } from 'react-router-dom';

import styled from 'styled-components';

import SneakerSearchBar from 'components/SneakerSearchBar';

import { signOut } from 'utils/auth';
import { useAuth } from 'providers/AuthProvider';

import { ADMIN, DASHBOARD, AUTH, SIGNIN, HOME } from 'routes';
import { useMarketPlaceCtx } from 'providers/marketplace/MarketPlaceProvider';
import { UserRankingRow, SearchBarSneaker } from '../../../../shared';
import UserControllerInstance from 'api/controllers/UserController';

import { UserRankingLeaderBoardDialog } from 'components/UserRankingLeaderBoard';

import logo from 'assets/img/logo_transparent_background.png';
import useOpenCloseComp from 'hooks/useOpenCloseComp';
import redirectBuySneakerPage from 'utils/redirectBuySneakerPage';

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

  const history = useHistory();
  const { signedIn } = useAuth();
  const { defaultSneakers } = useMarketPlaceCtx();

  const navigateBuySneakerPage = (sneaker: SearchBarSneaker) =>
    redirectBuySneakerPage(history, sneaker.name, sneaker.colorway);

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
          <SneakerSearchBar sneakers={defaultSneakers || []} onChooseSneaker={navigateBuySneakerPage} />
        </SearchBarWrapper>

        <Nav navbar>
          <NavItem>
            <div style={{ color: 'black', cursor: 'pointer' }} onClick={onOpenUserLeaderBoard} className='nav-link'>
              Leaderboard
            </div>
          </NavItem>

          {signedIn && (
            <NavItem>
              <Link style={{ color: 'black' }} to={ADMIN + DASHBOARD} className='nav-link'>
                Dashboard
              </Link>
            </NavItem>
          )}

          {signedIn ? (
            <NavItem onClick={() => signOut()}>
              <Link style={{ color: 'black' }} to={HOME} className='nav-link'>
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
