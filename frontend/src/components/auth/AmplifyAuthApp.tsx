import React, { useEffect } from 'react';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import { onAuthUIStateChange, AuthState, FederatedConfig } from '@aws-amplify/ui-components';

import { CustomerContext } from 'providers/CustomerContextProvider';
import { AuthStateContext } from 'providers/AuthStateProvider';

import { API_BASE_URL } from 'routes';

type GetCustomerQuery = {
  email: string;
  name: string;
  phoneNumber: string;
};

const encodePlusSign = (val: string) => val.replace('+', '%2B');

const formatQueryString = (query: { [key: string]: string }) => {
  let queryString = '';
  Object.entries(query).forEach(([key, val]) => {
    if (queryString !== '') queryString += '&';
    queryString += `${key}=${val}`;
  });

  return queryString;
};

const getCustomerId = async (userId: string, query: GetCustomerQuery) => {
  const customerBaseUrl = API_BASE_URL + `customer?userId=${userId}&`;
  // encode '+' to '%2B' to validly represent it in url query
  query.phoneNumber = encodePlusSign(query.phoneNumber);

  const queryString = formatQueryString(query);
  const customerEndpoint = customerBaseUrl + queryString;
  const customerId = await fetch(customerEndpoint).then((res) => res.text());

  return customerId;
};

const SignIn = () => {
  const federated: FederatedConfig = {
    googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    facebookAppId: process.env.REACT_APP_FB_APP_ID,
  };

  return <AmplifySignIn federated={federated} slot="sign-in" usernameAlias="email" />;
};

const SignUp = () => (
  <AmplifySignUp
    slot="sign-up"
    usernameAlias="email"
    formFields={[
      {
        type: 'name',
        label: 'Name',
        placeholder: 'Enter your full name',
      },
      { type: 'phone_number', placeholder: 'Enter your phone number' },
      { type: 'email' },
      { type: 'password' },
    ]}
  />
);

/**
 * NOTE: the error message "Custom auth lambda trigger is not configured for the user pool."
 * shows up but the user is identified and confirmed in the pool
 */
const CustomAmplifyAuthenticator = () => (
  <AmplifyAuthenticator usernameAlias="email">
    <SignIn />
    <SignUp />
  </AmplifyAuthenticator>
);

const AmplifyAuthApp: React.FunctionComponent = () => {
  const { updateAuthState, isUserSignedIn } = React.useContext(AuthStateContext);
  const { customerId, updateCustomerId, updateUserId } = React.useContext(CustomerContext);
  const [user, setUser] = React.useState<any>();

  // NOTE: is my approach to get the customer ID good here? An alternative better approach would be to conform to the Pub/Sub pattern. i.e.
  // sign in of the user will emit an event to other jobs so I can take specific actions such as retrieving the customer ID
  useEffect(() => {
    // TODO: how do I unsubscribe this event? It prompts me a warning saying cannot perform a React state update on an unmounted component
    // when redirecting back from the Profile page to here
    onAuthUIStateChange(async (nextAuthState, authData: any) => {
      /**
       * Cases where the if block evaluates to False
       * 1. User is signed in and customerId is non-empty
       * 2. Whenever the user is not in the signed in state
       *
       * Only fetching the customerId when the user is signed in and customer ID is empty. Although
       * getCustomerId is a linear runtime solution, it will have an amortimize constant runtime
       */
      if (nextAuthState === AuthState.SignedIn && !customerId) {
        const userId: string = authData.username;

        const email: string = authData.attributes.email;
        const name: string = authData.attributes.name;
        const phoneNumber: string = authData.attributes.phone_number;

        const currentUserCustomerId = await getCustomerId(userId, { email, name, phoneNumber });

        updateUserId(userId);
        updateCustomerId(currentUserCustomerId);
      } else updateCustomerId('');

      updateAuthState(nextAuthState);
      setUser(authData);
    });
  });

  return isUserSignedIn() && user ? (
    <div>
      <p>Hello, {user.username}</p>
      <AmplifySignOut />
    </div>
  ) : (
    <CustomAmplifyAuthenticator />
  );
};

export default AmplifyAuthApp;
