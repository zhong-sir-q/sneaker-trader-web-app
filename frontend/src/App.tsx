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

// IMPORTANT: the order of the imports of the css files matters
// css
import 'bootstrap/dist/css/bootstrap.css';
import 'assets/scss/now-ui-dashboard.scss';
import 'assets/css/demo.css';
import 'assets/css/sneakertrader.css';

// @ts-ignore
import awsconfig from 'aws-exports';

// providers
import AuthProvider, { useAuth } from 'providers/AuthProvider';
import MarketPlaceProvider from 'providers/marketplace/MarketPlaceProvider';

import NotFound from 'pages/NotFound';
import ListedSneakerRoutesProvider from 'providers/ListedSneakerRoutesProvider';

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

  return !signedIn ? <AuthLayout /> : <Redirect to={state as any || HOME} />;
};

const App = () => {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        {/* AuthProvider should be on the top-level as most app components consume the context  */}
        <AuthProvider>
          {/* Switch must be a direct parent of the Route components, otherwise it does not work */}
          <Switch>
            <Route path={AUTH} component={RelaxedAuth} />

            <Route path={ADMIN} component={ProtectedAdmin} />

            <Route path={HOME}>
              <ListedSneakerRoutesProvider>
                <MarketPlaceProvider>
                  <HomeLayout />
                </MarketPlaceProvider>
              </ListedSneakerRoutesProvider>
            </Route>

            {/* this currently does not work, ideally we want to show the 404 page
          when a random route is entered */}
            <Route component={NotFound} />
          </Switch>
        </AuthProvider>
      </Elements>
    </Router>
  );
};

export default App;
