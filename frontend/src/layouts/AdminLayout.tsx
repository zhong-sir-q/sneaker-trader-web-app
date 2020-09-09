import React, { useRef, ReactNode, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

// core components
// NOTE: an unpopular react component, consider switching it out
import NotificationAlert from 'react-notification-alert';
import PerfectScrollbar from 'perfect-scrollbar';

import AdminNavbar from 'components/navbars/AdminNavbar';
import Footer from 'components/Footer';

import { fetchCognitoUser } from 'utils/auth';
import routes, { SneakerTraderRoute, AUTH, SIGNIN, siderbarRoutes } from 'routes';
import Sidebar, { defaultSideBarProps } from 'components/Sidebar';

const getRoutes = (routes: SneakerTraderRoute[]): (ReactNode | null)[] => {
  return routes.map(({ collapse, views, layout, path, component }, idx) => {
    if (collapse) return getRoutes(views!);

    if (layout === '/admin') return <Route path={layout + path} component={component} key={idx} />;
    else return null;
  });
};

const getActiveRoute = (routes: SneakerTraderRoute[]): string => {
  const activeRoute = 'Sneaker Trader';

  for (const { name, views, collapse, layout, path } of routes) {
    if (collapse && views) {
      const collapseActiveRoute = getActiveRoute(views);
      if (collapseActiveRoute !== activeRoute) {
        return collapseActiveRoute;
      }
    } else {
      if (window.location.pathname.indexOf(layout + path) !== -1) return name;
    }
  }

  return activeRoute;
};

let ps: PerfectScrollbar;

const AdminLayout = () => {
  const mainPanel = useRef<HTMLDivElement>(null);
  const notificationAlert = useRef<any>(null);
  const history = useHistory();

  useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      document.documentElement.className += ' perfect-scrollbar-on';
      document.documentElement.classList.remove('perfect-scrollbar-off');
      ps = new PerfectScrollbar(mainPanel.current!);
    }

    return () => {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy();
        document.documentElement.className += ' perfect-scrollbar-off';
        document.documentElement.classList.remove('perfect-scrollbar-on');
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      const user = await fetchCognitoUser();
      if (!user) history.push(AUTH + SIGNIN);
    })();
  });

  const minimizeSideBar = () => {
    let message = 'Sidebar mini ';
    if (document.body.classList.contains('sidebar-mini')) message += 'deactivated...';
    else message += 'activated...';

    document.body.classList.toggle('sidebar-mini');
    const options = {
      place: 'tr',
      message,
      type: 'info',
      icon: 'now-ui-icons ui-1_bell-53',
      autoDismiss: 7,
    };

    notificationAlert.current.notificationAlert(options);
  };

  return (
    <div className='wrapper'>
      <NotificationAlert ref={notificationAlert} />
      <Sidebar {...defaultSideBarProps} minimizeSidebar={minimizeSideBar} routes={siderbarRoutes} />
      {/* NOTE: a temporary solution to make the panel scrollable, would
          not need it when the dashboard is properly implemented */}
      <div className='main-panel' style={{ overflowY: 'auto' }} ref={mainPanel}>
        <AdminNavbar brandText={getActiveRoute(routes)} />
        <Switch>
          {getRoutes(routes)}
          <Redirect from='/admin' to='/admin/dashboard' />
        </Switch>
        {
          // we don't want the Footer to be rendered on full screen maps page
          window.location.href.indexOf('full-screen-maps') !== -1 ? null : <Footer fluid default={false} />
        }
      </div>
    </div>
  );
};

export default AdminLayout;