import React, { useRef, ReactNode, useEffect, useState } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

// core components
// NOTE: an unpopular react component, consider switching it out
import NotificationAlert from 'react-notification-alert';
import PerfectScrollbar from 'perfect-scrollbar';

import AdminNavbar from 'components/navbars/AdminNavbar';
import Footer from 'components/Footer';

import routes, { SneakerTraderRoute, sidebarRoutes } from 'routes';
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
  // toggle this state to rerender the component upon route change
  const [, setReRender] = useState(false);

  const mainPanel = useRef<HTMLDivElement>(null);
  const notificationAlert = useRef<any>(null);
  const location = useLocation();

  useEffect(() => setReRender((val) => !val), [location]);

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

  const pinSidebar = () => {
    let message = 'Sidebar ';
    if (document.body.classList.contains('sidebar-mini')) message += 'pinned...';
    else message += 'unpinned...';

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
      <Sidebar {...defaultSideBarProps} minimizeSidebar={pinSidebar} routes={sidebarRoutes} />
      {/* NOTE: a temporary solution to make the panel scrollable, would
          not need it when the dashboard is properly implemented */}
      <div className='main-panel' style={{ overflowY: 'auto' }} ref={mainPanel}>
        <AdminNavbar brandText={getActiveRoute(routes)} />
        <Switch>
          {getRoutes(routes)}
          <Redirect from='/admin' to='/admin/dashboard' />
        </Switch>

        {
          // do not render footer on full screen maps page
          window.location.href.indexOf('full-screen-maps') !== -1 ? null : <Footer fluid default={false} />
        }
      </div>
    </div>
  );
};

export default AdminLayout;
