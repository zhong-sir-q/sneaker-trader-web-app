import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// reactstrap components
import { Collapse, Container, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from 'reactstrap';

import { HOME } from 'routes';

import { signOut } from 'utils/auth';

import { useUserRanking } from 'providers/UserRankingProvider';

type NavbarColor = 'transparent' | 'white';

type AdminNavbarProps = {
  // string for the page name
  brandText: string;
};

const AdminNavbar = (props: AdminNavbarProps) => {
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [color, setColor] = useState<NavbarColor>('transparent');

  const sidebarToggle = useRef<HTMLButtonElement>(null);

  const { onOpenLeaderBoard } = useUserRanking()

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => setColor(window.innerWidth < 993 && isOpenCollapse ? 'white' : 'transparent');

  useEffect(() => {
    // NOTE: currently not implementing what there is in the componentDidUpdate method
    // of AdminNavbar.js
    window.addEventListener('resize', updateColor);

    return () => window.removeEventListener('resize', updateColor);
  });

  const toggle = () => {
    setColor(isOpenCollapse ? 'transparent' : 'white');
    setIsOpenCollapse(!isOpenCollapse);
  };

  const openSidebar = () => {
    document.documentElement.classList.toggle('nav-open');
    if (sidebarToggle.current) sidebarToggle.current.classList.toggle('toggled');
  };

  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <Navbar
      color={window.location.href.indexOf('full-screen-maps') !== -1 ? 'white' : color}
      expand='lg'
      className={
        window.location.href.indexOf('full-screen-maps') !== -1
          ? 'navbar-absolute '
          : 'navbar-absolute ' + (color === 'transparent' ? 'navbar-transparent ' : '')
      }
    >
      <Container fluid>
        <div className='navbar-wrapper'>
          <div className='navbar-toggle'>
            <button type='button' ref={sidebarToggle} className='navbar-toggler' onClick={() => openSidebar()}>
              <span className='navbar-toggler-bar bar1' />
              <span className='navbar-toggler-bar bar2' />
              <span className='navbar-toggler-bar bar3' />
            </button>
          </div>
          <NavbarBrand>{props.brandText}</NavbarBrand>
        </div>
        <NavbarToggler onClick={toggle}>
          <span className='navbar-toggler-bar navbar-kebab' />
          <span className='navbar-toggler-bar navbar-kebab' />
          <span className='navbar-toggler-bar navbar-kebab' />
        </NavbarToggler>
        <Collapse className='justify-content-end' isOpen={isOpenCollapse} navbar>
          <Nav navbar>
            <NavItem>
              <div className='nav-link' onClick={onOpenLeaderBoard}>
                Leaderboard
              </div>
            </NavItem>
            <NavItem>
              <Link className='nav-link' to={HOME} onClick={() => signOut()} data-testid='admin-navbar-logout'>
                Log out
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
