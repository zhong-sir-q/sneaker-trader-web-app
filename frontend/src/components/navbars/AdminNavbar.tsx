import React, { useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

// reactstrap components
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from 'reactstrap';
import { Auth } from 'aws-amplify';
import { SIGNIN, AUTH } from 'routes';

type NavbarColor = 'transparent' | 'white';

type AdminNavbarProps = {
  // string for the page name
  brandText: string;
}

const signOut = () => Auth.signOut().catch((err) => console.log(err));

const AdminNavbar = (props: AdminNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [color, setColor] = useState<NavbarColor>('transparent');
  const sidebarToggle = useRef<HTMLButtonElement>(null);

  const history = useHistory();

  const toggle = () => {
    setColor(isOpen ? 'transparent' : 'white');
    setIsOpen(!isOpen);
  };

  const dropdownToggle = () => setDropdownOpen(!dropdownOpen);

  const openSidebar = () => {
    document.documentElement.classList.toggle('nav-open');
    if (sidebarToggle.current) sidebarToggle.current.classList.toggle('toggled');
  };

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => setColor(window.innerWidth < 993 && isOpen ? 'white' : 'transparent');

  useEffect(() => {
    // NOTE: currently not implementing what there is in the componentDidUpdate method
    // of AdminNavbar.js
    window.addEventListener('resize', updateColor);

    return () => window.removeEventListener('resize', updateColor);
  });

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
          <NavbarBrand href='/'>{props.brandText}</NavbarBrand>
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
            <NavItem>
              <Link to='#pablo' className='nav-link'>
                <i className='now-ui-icons media-2_sound-wave' />
                <p>
                  <span className='d-lg-none d-md-block'>Stats</span>
                </p>
              </Link>
            </NavItem>
            <Dropdown nav isOpen={dropdownOpen} toggle={() => dropdownToggle()}>
              <DropdownToggle caret nav>
                <i className='now-ui-icons location_world' />
                <p>
                  <span className='d-lg-none d-md-block'>Some Actions</span>
                </p>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  tag='a'
                  onClick={async () => {
                    await signOut();
                    history.push(AUTH + SIGNIN);
                  }}
                >
                  Sign Out
                </DropdownItem>
                <DropdownItem tag='a'>Action</DropdownItem>
                <DropdownItem tag='a'>Another Action</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <NavItem>
              <Link to='#pablo' className='nav-link'>
                <i className='now-ui-icons users_single-02' />
                <p>
                  <span className='d-lg-none d-md-block'>Account</span>
                </p>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
