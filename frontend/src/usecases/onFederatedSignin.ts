import { Auth } from 'aws-amplify';

import { UserController } from 'api/controllers/UserController';

import { SocialProvider } from '../../../shared';

const onFederatedSignin = (UserControllerInstance: UserController) => async (
  provider: SocialProvider,
  token: string,
  expires_at: number,
  user: { email: string; name: string }
) => {
  // if the user has used the email already but not using the current provider, reject the user from signin
  const currUser = await UserControllerInstance.getByEmail(user.email);
  if (currUser && currUser.signinMethod !== provider) throw new Error('Email already exists');
  // otherwise create the user if it does not exist
  if (!currUser) await UserControllerInstance.create({ email: user.email, signinMethod: provider });

  await Auth.federatedSignIn(provider as any, { token, expires_at }, user);
};

export default onFederatedSignin;
