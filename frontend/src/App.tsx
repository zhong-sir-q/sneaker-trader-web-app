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
import 'cropperjs/dist/cropper.css';

// providers
import AuthProvider, { useAuth } from 'providers/AuthProvider';
import MarketPlaceProvider from 'providers/marketplace/MarketPlaceProvider';

import NotFound from 'pages/NotFound';
import ListedSneakerRoutesProvider from 'providers/ListedSneakerRoutesProvider';
import UserRankingProvider from 'providers/UserRankingProvider';

import ListedSneakerControllerInstance from 'api/controllers/ListedSneakerController';
import EditListedSneakerRoutesProvider from 'providers/EditListedSneakerRoutesProvider';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string);

Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_WEB_CLIENT_ID,
  },
});

const ProtectedAdmin = () => {
  const { signedIn } = useAuth();

  return signedIn ? <AdminLayout /> : <Redirect to={AUTH + SIGNIN} />;
};

const RelaxedAuth = (props: RouteComponentProps<any>) => {
  const { signedIn } = useAuth();
  const { state } = props.location;

  // clear the cache before returning the route
  const clearCachedRoute = () => {
    const cachedRoute = localStorage.getItem('cached_route');
    localStorage.removeItem('cached_route');
    return cachedRoute;
  };

  // state has the highest priority, then cached route, then HOME
  return !signedIn ? <AuthLayout /> : <Redirect to={(state as any) || clearCachedRoute() || HOME} />;
};

const App = () => {
  return (
    // AuthProvider should be on the top-level as most app components consume the context
    <AuthProvider>
      <Router>
        <Elements stripe={stripePromise}>
          {/* Switch must be a direct parent of the Route components, otherwise it does not work */}
          <Switch>
            <Route path={AUTH} component={RelaxedAuth} />

            <Route path={ADMIN}>
              <EditListedSneakerRoutesProvider listedSneakerController={ListedSneakerControllerInstance}>
                <ProtectedAdmin />
              </EditListedSneakerRoutesProvider>
            </Route>

            <UserRankingProvider>
              <ListedSneakerRoutesProvider listedSneakerController={ListedSneakerControllerInstance}>
                <MarketPlaceProvider listedSneakerController={ListedSneakerControllerInstance}>
                  <HomeLayout />
                </MarketPlaceProvider>
              </ListedSneakerRoutesProvider>
            </UserRankingProvider>

            {/* this currently does not work, ideally we want to show the 404 page
            when a random route is entered */}
            <Route path='*' component={NotFound} />
          </Switch>
        </Elements>
      </Router>
    </AuthProvider>
  );
};

export default App;
