import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

// reactstrap components
import { Button, Collapse, Nav } from 'reactstrap';

// routes
import { ADMIN, HOME, RouteState, SneakerTraderRoute, USER_PROFILE } from 'routes';

import { useAuth } from 'providers/AuthProvider';

import logo from 'assets/img/logo_transparent_background.png';
import defaultAvatar from 'assets/img/placeholder.jpg';
import { signOut } from 'utils/auth';
import { useUserRanking } from 'providers/UserRankingProvider';

type SideBarBackgroundColor = 'blue' | 'yellow' | 'green' | 'orange' | 'red';

type SideBarProps = {
  // TODO: type this
  routes: any[];
  showNotification: boolean;
  backgroundColor: SideBarBackgroundColor;
  minimizeSidebar: () => void;
};

export const defaultSideBarProps: SideBarProps = {
  routes: [],
  showNotification: false,
  backgroundColor: 'blue' as SideBarBackgroundColor,
  minimizeSidebar: () => {},
};

// this verifies if any of the collapses should be default opened on a rerender of this component
// for example, on the refresh of the page, while on the src/views/forms/RegularForms.js - route /admin/regular-forms
const getCollapseInitialState = (routes: SneakerTraderRoute[]) => {
  for (const { collapse, views, path } of routes)
    if ((collapse && views && getCollapseInitialState(views)) || window.location.href.indexOf(path) !== -1) return true;

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
  // toggle this state to rerender the component upon route change
  const [, setReRender] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();
  const { onOpenLeaderBoard } = useUserRanking();

  // TODO: type this
  const sidebar = useRef<any>(null);

  useEffect(() => {
    setReRender((val) => !val);
  }, [location]);

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
          <Link to={HOME} className='simple-text logo-mini'>
            <div className='logo-img'>
              <img src={logo} alt='sneakertrader-logo' />
            </div>
          </Link>
          <Link to={HOME} className='simple-text logo-normal'>
            Home
          </Link>

          <div className='navbar-minimize'>
            <Button
              outline
              className='btn-round btn-icon'
              color='neutral'
              id='minimizeSidebar'
              onClick={props.minimizeSidebar}
            >
              <i className='now-ui-icons text_align-center visible-on-sidebar-regular' />
              <i className='now-ui-icons design_bullet-list-67 visible-on-sidebar-mini' />
            </Button>
          </div>
        </div>

        <div className='sidebar-wrapper' ref={sidebar}>
          <div className='user'>
            <div className='photo' style={{ backgroundColor: 'white' }}>
              <img className='h-100' src={currentUser?.profilePicUrl || defaultAvatar} alt='uploaed file' />
            </div>
            <div className='info'>
              <a
                href='#pablo'
                data-toggle='collapse'
                aria-expanded={collapseStates.openAvatar}
                onClick={() => setCollapseStates({ ...collapseStates, openAvatar: !collapseStates.openAvatar })}
              >
                <span>
                  {currentUser?.username || 'DEFAULT_USERNAME'}
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
          <Nav>
            {createLinks(props.routes)}
            <li>
              {/* location is unchanged */}
              <NavLink to={location.pathname} onClick={onOpenLeaderBoard}>
                <React.Fragment>
                  <i className='now-ui-icons design_scissors' />
                  <p>Leaderboard</p>
                </React.Fragment>
              </NavLink>
            </li>
            <li>
              <NavLink to={HOME} onClick={() => signOut()}>
                <React.Fragment>
                  <i className='now-ui-icons arrows-1_minimal-right' />
                  <p>Logout</p>
                </React.Fragment>
              </NavLink>
            </li>
          </Nav>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
