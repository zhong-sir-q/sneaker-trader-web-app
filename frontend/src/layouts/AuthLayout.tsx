import React, { useEffect } from 'react';

// core components
import Footer from 'components/Footer';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';

import routes, { SneakerTraderRoute, AUTH, SIGNIN, DASHBOARD, ADMIN } from 'routes';
import AuthNavbar from 'components/navbars/AuthNavbar';
import { getCurrentUser } from 'utils/auth';

const getRoutes = (_routes: SneakerTraderRoute[]) => {
  return _routes.map((route, idx) => {
    if (route.layout === '/auth') return <Route path={route.layout + route.path} component={route.component} key={idx} />;
    else return null;
  });
};

const AuthLayout = () => {
  const history = useHistory()
  
  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser()
      if (currentUser) history.push(ADMIN + DASHBOARD)
    })()
  })

  return (
    <React.Fragment>
      <AuthNavbar />
      <div className='wrapper wrapper-full-page'>
        <div className='full-page section-image' filter-color='yellow'>
          <Switch>
            {getRoutes(routes)}
            <Redirect from={AUTH} to={`${AUTH}${SIGNIN}`} />
          </Switch>
          <Footer fluid default={false} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default AuthLayout;
