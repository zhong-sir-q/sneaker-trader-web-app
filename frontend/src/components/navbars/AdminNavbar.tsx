import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// reactstrap components
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Container,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
} from 'reactstrap';


import { signOut } from 'utils/auth';
import { HOME } from 'routes';

type NavbarColor = 'transparent' | 'white';

type AdminNavbarProps = {
  // string for the page name
  brandText: string;
};

const AdminNavbar = (props: AdminNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState<NavbarColor>('transparent');
  const sidebarToggle = useRef<HTMLButtonElement>(null);

  const history = useHistory();

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => setColor(window.innerWidth < 993 && isOpen ? 'white' : 'transparent');

  useEffect(() => {
    // NOTE: currently not implementing what there is in the componentDidUpdate method
    // of AdminNavbar.js
    window.addEventListener('resize', updateColor);

    return () => window.removeEventListener('resize', updateColor);
  });

  const toggle = () => {
    setColor(isOpen ? 'transparent' : 'white');
    setIsOpen(!isOpen);
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
        <Collapse isOpen={isOpen} navbar className='justify-content-end'>
          <form>
            <InputGroup className='no-border'>
              <Input placeholder='Search...' />

              <InputGroupAddon addonType='append'>
                <InputGroupText>
                  <i className='now-ui-icons ui-1_zoom-bold' />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </form>
          <Nav navbar>
            <Button onClick={() => signOut(history, HOME)}>Log out</Button>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
