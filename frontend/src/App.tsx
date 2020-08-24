import Amplify from 'aws-amplify';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// layouts
import AuthLayout from 'layouts/AuthLayout';
import AdminLayout from 'layouts/AdminLayout';

// routes
import { AUTH, ADMIN, DASHBOARD } from 'routes';

// css
import 'bootstrap/dist/css/bootstrap.css';
import 'assets/scss/now-ui-dashboard.scss';
import 'assets/css/demo.css';

// @ts-ignore
import awsconfig from 'aws-exports';

Amplify.configure({
  ...awsconfig,
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
});

const App = () => (
  <Router>
    <Switch>
      <Route path={AUTH}>
        <AuthLayout />
      </Route>

      <Route path={ADMIN}>
        <AdminLayout />
      </Route>

      <Redirect to={ADMIN + DASHBOARD} />
    </Switch>
  </Router>
);

export default App;
