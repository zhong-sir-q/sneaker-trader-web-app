import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, Container } from 'reactstrap';

import logo from 'assets/img/logo_transparent_background.png';

import { AUTH, SIGNIN, SIGNUP, MARKET_PLACE } from 'routes';

const AuthNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar expand='lg' className={isOpen ? 'bg-white navbar-absolute' : 'navbar-transparent navbar-absolute'}>
      <Container fluid>
        <div className='navbar-wrapper'>
          <div className='navbar-toggle'>
            <NavbarToggler onClick={() => setIsOpen(!isOpen)}>
              <span className='navbar-toggler-bar bar1' />
              <span className='navbar-toggler-bar bar2' />
              <span className='navbar-toggler-bar bar3' />
            </NavbarToggler>
          </div>
          <Link to={MARKET_PLACE} style={{ width: '120px' }}>
            <img src={logo} alt='sneakertrader-logo' />
          </Link>
        </div>
        <Collapse isOpen={isOpen} navbar>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <Link to='/admin/dashboard' className='nav-link'>
                <i className='now-ui-icons design_bullet-list-67' /> Dashboard
              </Link>
            </NavItem>
            <NavItem>
              <Link to={AUTH + SIGNIN} className='nav-link'>
                <i className='now-ui-icons users_circle-08' /> Login
              </Link>
            </NavItem>
            <NavItem>
              <Link to={AUTH + SIGNUP} className='nav-link'>
                <i className='now-ui-icons tech_mobile' /> Register
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default AuthNavbar;
