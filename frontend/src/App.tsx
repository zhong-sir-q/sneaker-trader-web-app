import Amplify from 'aws-amplify';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Layout from 'components/Layout';
import Profile from 'components/Profile';
import Products from 'components/Products';
import NewProductForm from 'components/NewProductForm';
import AmplifyAuthApp from 'components/auth/AmplifyAuthApp';

import AuthStateProvider from 'providers/AuthStateProvider';

// @ts-ignore
import awsconfig from 'aws-exports';

import 'css/global.css';

Amplify.configure(awsconfig);

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <AuthStateProvider>
            <Layout>
              <Profile />
              <AmplifyAuthApp />
              <NewProductForm />
              <Products />
            </Layout>
          </AuthStateProvider>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
