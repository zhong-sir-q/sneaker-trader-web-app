import Amplify from 'aws-amplify';
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// layouts
import HomeLayout from 'layouts/HomeLayout';
import AuthLayout from 'layouts/AuthLayout';
import AdminLayout from 'layouts/AdminLayout';

// routes
import { AUTH, ADMIN, SIGNIN, HOME } from 'routes';

// css
import 'bootstrap/dist/css/bootstrap.css';
import 'assets/scss/now-ui-dashboard.scss';
import 'assets/css/demo.css';
import 'assets/css/sneakertrader.css';

// @ts-ignore
import awsconfig from 'aws-exports';

import AuthProvider, { useAuth } from 'providers/AuthProvider';
import HomePageCtxProvider from 'providers/marketplace/HomePageCtxProvider';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string);

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

const RelaxedAuth = (props: RouteComponentProps<any>) => {
  const { signedIn } = useAuth();
  const { state } = props.location;

  return !signedIn ? <AuthLayout /> : <Redirect to={state || HOME} />;
};

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <Router>
          <Switch>
            <Route path={AUTH} render={(routeProps) => <RelaxedAuth {...routeProps} />} />

            <Route path={ADMIN}>
              <ProtectedAdmin />
            </Route>

            <Route path={HOME}>
              <HomePageCtxProvider>
                <HomeLayout />
              </HomePageCtxProvider>
            </Route>

            <Redirect from='/' to={HOME} />
          </Switch>
        </Router>
      </AuthProvider>
    </Elements>
  );
};

export default App;
