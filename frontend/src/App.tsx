import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import 'assets/css/demo.css';
import 'assets/css/sneakertrader.css';
import 'assets/scss/now-ui-dashboard.scss';
import Amplify from 'aws-amplify';
// @ts-ignore
import awsconfig from 'aws-exports';
// css
import 'bootstrap/dist/css/bootstrap.css';
import AdminLayout from 'layouts/AdminLayout';
import AuthLayout from 'layouts/AuthLayout';
// layouts
import HomeLayout from 'layouts/HomeLayout';
// providers
import AuthProvider, { useAuth } from 'providers/AuthProvider';
import HomePageProvider from 'providers/marketplace/HomePageProvider';
import UserStatsProvider from 'providers/marketplace/UserStatsProvider';
import PreviewImgDropzoneProvider from 'providers/PreviewImgDropzoneProvider';
import SneakerListingFormProvider from 'providers/SneakerListingFormProvider';
import TransactionTableProvider from 'providers/TransactionTableProvider';
import WalletProvider from 'providers/WalletProvider';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
// routes
import { ADMIN, AUTH, HOME, SIGNIN } from 'routes';

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

const DashboardProviders = (props: { children: React.ReactNode }) => (
  <TransactionTableProvider>
    <WalletProvider>
      <UserStatsProvider>
        <SneakerListingFormProvider>
          <PreviewImgDropzoneProvider>{props.children}</PreviewImgDropzoneProvider>
        </SneakerListingFormProvider>
      </UserStatsProvider>
    </WalletProvider>
  </TransactionTableProvider>
);

const App = () => {
  return (
    <Router>
      <Switch>
        <AuthProvider>
          <Route path={AUTH} render={(routeProps) => <RelaxedAuth {...routeProps} />} />

          <Route path={ADMIN}>
            <DashboardProviders>
              <Elements stripe={stripePromise}>
                <ProtectedAdmin />
              </Elements>
            </DashboardProviders>
          </Route>

          <Route path={HOME}>
            <HomePageProvider>
              <HomeLayout />
            </HomePageProvider>
          </Route>
        </AuthProvider>
      </Switch>
    </Router>
  );
};

export default App;
