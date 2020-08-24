import React, { useRef, ReactNode, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

// core components
import AdminNavbar from 'components/navbars/AdminNavbar';
import Footer from 'components/Footer';

import routes, { SneakerTraderRoute, AUTH, SIGNIN } from 'routes';
import { Auth } from 'aws-amplify';

const getRoutes = (routes: SneakerTraderRoute[]): (ReactNode | null)[] => {
  return routes.map((route, idx) => {
    if (route.collapse) {
      return getRoutes(route.views);
    }

    if (route.layout === '/admin') {
      return <Route path={route.layout + route.path} component={route.component} key={idx} />;
    } else {
      return null;
    }
  });
};

const getActiveRoute = (routes: SneakerTraderRoute[]): string => {
  let activeRoute = 'Default Brand Text';

  for (let i = 0; i < routes.length; i++) {
    if (routes[i].collapse) {
      const { views } = routes[i];
      if (views) {
        const collapseActiveRoute = getActiveRoute(views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      }
    } else {
      if (window.location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
  }

  return activeRoute;
};

const AdminLayout = () => {
  const mainPanel = useRef<HTMLDivElement>(null);
  const history = useHistory()

  useEffect(() => {
    (async () => {
      const user = await Auth.currentAuthenticatedUser().then(res => res).catch(err => console.log(err))

      // user is not logged in
      if (!user) history.push(AUTH + SIGNIN)
    })()
  }, [history])

  return (
    <div className='wrapper'>
      {/* NOTE: the Sidebar is not fully typed */}
      {/* <Sidebar routes={routes} minimizeSidebar={minimizeSidebar} backgroundColor={'blue'} /> */}
      <div className='main-panel' ref={mainPanel}>
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
