import Amplify from 'aws-amplify';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Layout from 'components/Layout';
import Products from 'components/Products';
import BuyingHistory from 'components/BuyingHistory';
import NewProductForm from 'components/NewProductForm';
import AmplifyAuthApp from 'components/auth/AmplifyAuthApp';
import CheckoutSuccess from 'components/CheckoutSuccess';
import CheckoutCancelled from 'components/CheckoutCancelled';

import AuthStateProvider from 'providers/AuthStateProvider';
import CustomerContextProvider from 'providers/CustomerContextProvider';

import 'css/global.css';

// @ts-ignore
import awsconfig from 'aws-exports';
import Profile from 'components/Profile';

Amplify.configure(awsconfig);

const App = () => {
  return (
    <CustomerContextProvider>
      <AuthStateProvider>
        <Router>
          <Switch>
            <Route path="/success">
              <CheckoutSuccess />
            </Route>
            <Route path="/cancelled">
              <CheckoutCancelled />
            </Route>
            <Route path="/">
              <Layout>
                <Profile />
                <BuyingHistory />
                <AmplifyAuthApp />
                <NewProductForm />
                <Products />
              </Layout>
            </Route>
          </Switch>
        </Router>
      </AuthStateProvider>
    </CustomerContextProvider>
  );
};

export default App;
