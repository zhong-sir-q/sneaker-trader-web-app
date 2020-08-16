import Amplify, { Auth } from 'aws-amplify';
import React from 'react';

import Layout from 'components/Layout';
import Products from 'components/Products';
import BuyingHistory from 'components/BuyingHistory';
import NewProductForm from 'components/NewProductForm';
import AmplifyAuthApp from 'components/auth/AmplifyAuthApp';

import AuthStateProvider from 'providers/AuthStateProvider';
import CustomerContextProvider from 'providers/CustomerContextProvider';

import 'css/global.css';

// @ts-ignore
import awsconfig from 'aws-exports';

Amplify.configure(awsconfig);


const App = () => {

  return (
    <CustomerContextProvider>
      <AuthStateProvider>
        <Layout>
          <p>
            <strong>Sneaker Trader</strong>
          </p>
          <AmplifyAuthApp />
          {/* <BuyingHistory /> */}
          <NewProductForm />
          <Products />
        </Layout>
      </AuthStateProvider>
    </CustomerContextProvider>
  );
};

export default App;
