import Amplify from 'aws-amplify';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// layouts
import HomeLayout from 'layouts/HomeLayout';
import AuthLayout from 'layouts/AuthLayout';
import AdminLayout from 'layouts/AdminLayout';

// routes
import { AUTH, ADMIN, SIGNIN, HOME, DASHBOARD } from 'routes';

// css
import 'bootstrap/dist/css/bootstrap.css';
import 'assets/scss/now-ui-dashboard.scss';
import 'assets/css/demo.css';
import 'assets/css/sneakertrader.css';

// @ts-ignore
import awsconfig from 'aws-exports';

import AuthProvider, { useAuth } from 'providers/AuthProvider';

Amplify.configure({
  ...awsconfig,
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
});

const ProtectedAdmin = () => {
  const { signedIn } = useAuth();

  return signedIn ? <AdminLayout /> : <Redirect to={AUTH + SIGNIN} />;
};

const RelaxedAuth = () => {
  const { signedIn } = useAuth();

  return !signedIn ? <AuthLayout /> : <Redirect to={ADMIN + DASHBOARD} />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path={AUTH}>
            <RelaxedAuth />
          </Route>

          <Route path={ADMIN}>
            <ProtectedAdmin />
          </Route>

          <Route path={HOME}>
            <HomeLayout />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
