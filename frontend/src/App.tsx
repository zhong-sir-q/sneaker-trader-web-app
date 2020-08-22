import Amplify from 'aws-amplify';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// layouts
import AuthLayout from 'layouts/AuthLayout';

import { AUTH, SIGNIN } from 'routes';

// css
import 'bootstrap/dist/css/bootstrap.css';
import 'assets/scss/now-ui-dashboard.scss';
import 'assets/css/demo.css';
import 'css/global.css';

// @ts-ignore
import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);

const App = () => <Router>
  <Switch>
    <Route path={AUTH}>
      <AuthLayout />
    </Route>
    <Redirect to={`${AUTH}${SIGNIN}`} />
  </Switch>
</Router>

export default App;
