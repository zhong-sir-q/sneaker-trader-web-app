import { Auth } from 'aws-amplify';

import { UserController } from 'api/controllers/UserController';

import { SocialProvider } from '../../../shared';
import { UserRegistrationController } from 'api/controllers/UserRegistrationController';

const onFederatedSignin = (UserInstance: UserController, UserRegistrationInstance: UserRegistrationController) => async (
  provider: SocialProvider,
  token: string,
  expires_at: number,
  user: { email: string; name: string }
) => {
  // if the user has used the email already but not using the current provider, reject the user from signin

  const currUser = await UserInstance.getByEmail(user.email);
  if (currUser && currUser.signinMethod !== provider) throw new Error('Email already exists');
  // otherwise create the user if it does not exist
  if (!currUser) await UserRegistrationInstance.register({ email: user.email, username: user.name, signinMethod: provider });

  await Auth.federatedSignIn(provider as string, { token, expires_at }, user);
};

export default onFederatedSignin;
