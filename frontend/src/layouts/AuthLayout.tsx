import React, { ReactNode } from 'react';

// core components
import Footer from 'components/Footer';
import { Switch, Route, Redirect } from 'react-router-dom';

import routes, { SneakerTraderRoute, AUTH, SIGNIN } from 'routes';

const AuthLayout = () => {
  const getRoutes = (_routes: SneakerTraderRoute[]) => {
    return _routes.map((route, idx) => {
      if (route.layout === '/auth') return <Route path={route.layout + route.path} component={route.component} key={idx} />;
      else return null;
    });
  };

  return (
    <div className="wrapper wrapper-full-page">
      <div className="full-page section-image" filter-color="yellow">
        <Switch>
          {getRoutes(routes)}
          <Redirect from={AUTH} to={`${AUTH}${SIGNIN}`} />
        </Switch>
        <Footer fluid default={false} />
      </div>
    </div>
  );
};

export default AuthLayout;
