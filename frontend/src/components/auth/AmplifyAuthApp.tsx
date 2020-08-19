import React, { useEffect } from 'react';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import { onAuthUIStateChange, FederatedConfig } from '@aws-amplify/ui-components';

import { AuthStateContext } from 'providers/AuthStateProvider';


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
  const [user, setUser] = React.useState<any>();

  useEffect(() => {
    // TODO: how do I unsubscribe this event? It prompts me a warning saying cannot perform a React state update on an unmounted component
    // when redirecting back from the Profile page to here
    onAuthUIStateChange(async (nextAuthState, authData: any) => {
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
