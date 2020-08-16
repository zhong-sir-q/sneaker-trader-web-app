import React from 'react';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';
import { onAuthUIStateChange, AuthState } from '@aws-amplify/ui-components';

import { CustomerContext } from 'providers/CustomerContextProvider';
import { AuthStateContext } from 'providers/AuthStateProvider';

import { API_BASE_URL } from 'routes'

const getCustomerId = async (userId: string, email: string) => {
  const customerEndpoint = API_BASE_URL + `customer/${userId}`
  const customerId = await fetch(customerEndpoint + `?email=${email}`).then((res) => res.text());

  return customerId;
};

const SignIn = () => <AmplifySignIn slot="sign-in" usernameAlias="email" />;

const SignUp = () => <AmplifySignUp slot="sign-up" usernameAlias="email" formFields={[{ type: 'email' }, { type: 'password' }]} />;

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
  const { customerId, updateCustomerId } = React.useContext(CustomerContext)
  const [user, setUser] = React.useState<any>();

  React.useEffect(() => {
    onAuthUIStateChange(async (nextAuthState, authData) => {
      // TODO: need optimization, maybe there is a better solution than what I am doing here
      // e.g. fetching the customer id as soon as the user is signed in. checking whether the user
      // exists in the database is a linear runtime solution
      if (nextAuthState === AuthState.SignedIn && !customerId) {
        // authData here is a CognitoUser object
        // TODO: either manually write or install this type
        // so I don't have to check whether the currentUserId is undefined or not
        const currentUserId = (authData as any).username;
        const { email } = (authData as any).attributes

        if (currentUserId) {
          const currentUserCustomerId = await getCustomerId(currentUserId, email);
          updateCustomerId(currentUserCustomerId);
        }
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
