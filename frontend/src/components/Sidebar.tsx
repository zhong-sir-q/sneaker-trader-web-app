import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

// reactstrap components
import { Nav, Collapse, Button } from 'reactstrap';

// core components
import avatar from 'assets/img/ryan.jpg';
// import logo from 'logo-white.svg';
import logo from 'assets/img/logo_transparent_background.png';

// routes
import { SneakerTraderRoute, View, RouteState, ADMIN, USER_PROFILE } from 'routes';
import { fetchCognitoUser } from 'utils/auth';
import { fetchUserByEmail } from 'api/api';
import { User } from '../../../shared';

type SideBarBackgroundColor = 'blue' | 'yellow' | 'green' | 'orange' | 'red';

type SideBarProps = {
  // TODO: type this
  routes: any[];
  showNotification: boolean;
  backgroundColor: SideBarBackgroundColor;
  minimizeSidebar: () => void;
}

export const defaultSideBarProps: SideBarProps = {
  routes: [],
  showNotification: false,
  backgroundColor: 'blue' as SideBarBackgroundColor,
  minimizeSidebar: () => {},
};

// this verifies if any of the collapses should be default opened on a rerender of this component
// for example, on the refresh of the page, while on the src/views/forms/RegularForms.js - route /admin/regular-forms
const getCollapseInitialState = (routes: SneakerTraderRoute[]) => {
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].collapse && getCollapseInitialState(routes[i].views as View[])) {
      return true;
    } else if (window.location.href.indexOf(routes[i].path) !== -1) {
      return true;
    }
  }
  return false;
};

type CollapseStateType = { [state in RouteState]: boolean };

// this creates the intial state of this component based on the collapse routes
// that it gets through props.routes
const getCollapseStates = (routes: SneakerTraderRoute[]): CollapseStateType => {
  let initialState = {} as CollapseStateType;

  routes.map((route) => {
    if (route.collapse) {
      initialState = {
        [route.state]: getCollapseInitialState(route.views),
        ...getCollapseStates(route.views),
        ...initialState,
      };
    }

    return null;
  });

  return initialState;
};

const activeRoute = (routeName: string) => (window.location.href.indexOf(routeName) > -1 ? 'active' : '');

type SideBarStateType = CollapseStateType & { openAvatar: boolean };

// TODO: type this component properly
const Sidebar = (props: SideBarProps) => {
  const [collapseStates, setCollapseStates] = useState({ openAvatar: false, ...getCollapseStates(props.routes) });
  const [userName, setUserName] = useState<string>();

  // TODO: type this
  const sidebar = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const cognitoUser = await fetchCognitoUser().catch(err => console.log(err));
      // handle get cognito user error
      if (!cognitoUser) return
      const cognitoFullName = cognitoUser.name;

      const dbUser: User | void = await fetchUserByEmail(cognitoUser.email).catch(err => console.log(err));
      // handle fetch db user error
      if (!dbUser) return
      const { firstName, lastName } = dbUser;
      const dbFullName = firstName && lastName ? firstName + ' ' + lastName : undefined;

      setUserName(dbFullName || cognitoFullName);
    })();
  });

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes: SneakerTraderRoute[]) => {
    return routes.map((route, idx) => {
      if (route.collapse) {
        // TODO: figure out what st is and rename the variable
        let st = {} as SideBarStateType;
        st[route.state] = !collapseStates[route.state];

        // TODO: refactor out to individual components
        return (
          <li className={getCollapseInitialState(route.views) ? 'active' : ''} key={idx}>
            <a
              href='#pablo'
              target='_blank'
              rel='noopener noreferrer'
              data-toggle='collapse'
              aria-expanded={collapseStates[route.state]}
              onClick={(e) => {
                e.preventDefault();
                setCollapseStates(st);
              }}
            >
              {route.icon !== undefined ? (
                <React.Fragment>
                  <i className={route.icon} />
                  <p>
                    {route.name}
                    <b className='caret' />
                  </p>
                </React.Fragment>
              ) : (
                // TODO: examine the route.mini type error
                <React.Fragment>
                  <span className='sidebar-mini-icon'>{'route.mini'}</span>
                  <span className='sidebar-normal'>
                    {route.name}
                    <b className='caret' />
                  </span>
                </React.Fragment>
              )}
            </a>
            <Collapse isOpen={collapseStates[route.state]}>
              <ul className='nav'>{createLinks(route.views)}</ul>
            </Collapse>
          </li>
        );
      }

      return (
        <li className={activeRoute(route.layout + route.path)} key={idx}>
          <NavLink to={route.layout + route.path} activeClassName=''>
            {route.icon !== undefined ? (
              <React.Fragment>
                <i className={route.icon} />
                <p>{route.name}</p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <span className='sidebar-mini-icon'>{'route.mini'}</span>
                <span className='sidebar-normal'>{route.name}</span>
              </React.Fragment>
            )}
          </NavLink>
        </li>
      );
    });
  };

  return (
    <React.Fragment>
      <div className='sidebar' data-color={props.backgroundColor}>
        <div className='logo'>
          <a href='#pablo' className='simple-text logo-mini'>
            <div className='logo-img'>
              <img src={logo} alt='react-logo' />
            </div>
          </a>
          <a href='#pablo' className='simple-text logo-normal'>
            Sneaker Trader
          </a>
          <div className='navbar-minimize'>
            <Button outline className='btn-round btn-icon' color='neutral' id='minimizeSidebar' onClick={() => props.minimizeSidebar()}>
              <i className='now-ui-icons text_align-center visible-on-sidebar-regular' />
              <i className='now-ui-icons design_bullet-list-67 visible-on-sidebar-mini' />
            </Button>
          </div>
        </div>

        <div className='sidebar-wrapper' ref={sidebar}>
          <div className='user'>
            <div className='photo'>
              {/* TODO: use a default profile pic if user does not have one */}
              <img src={avatar} alt='Avatar' />
            </div>
            <div className='info'>
              <a
                href='#pablo'
                data-toggle='collapse'
                aria-expanded={collapseStates.openAvatar}
                onClick={() => setCollapseStates({ ...collapseStates, openAvatar: !collapseStates.openAvatar })}
              >
                <span>
                  {/* TODO: do we want the username or first&last name */}
                  {userName}
                  <b className='caret' />
                </span>
              </a>
              <Collapse isOpen={collapseStates.openAvatar}>
                <ul className='nav'>
                  <li>
                    <Link to={ADMIN + USER_PROFILE}>
                      <span className='sidebar-mini-icon'>MP</span>
                      <span className='sidebar-normal'>My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <a href='#pablo' onClick={(e) => e.preventDefault}>
                      <span className='sidebar-mini-icon'>S</span>
                      <span className='sidebar-normal'>Settings</span>
                    </a>
                  </li>
                </ul>
              </Collapse>
            </div>
          </div>
          <Nav>{createLinks(props.routes)}</Nav>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
