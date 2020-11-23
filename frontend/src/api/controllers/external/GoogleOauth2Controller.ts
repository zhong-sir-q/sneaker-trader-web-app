import jwt_decode from 'jwt-decode';

import formatApiEndpoint, { concatPaths } from 'utils/formatApiEndpoint';
import formatRequestOptions from 'utils/formatRequestOptions';

import UserControllerInstance from '../UserController';
import UserRegistrationControllerInstance from '../UserRegistrationController';

import onFederatedSignin from 'usecases/onFederatedSignin';

import GoogleOauthEntity from '../../../../../shared/@types/domains/entities/GoogleOauthEntity';

export class GoogleOauth2Controller implements GoogleOauthEntity {
  private readonly googleAuthPath: string;

  constructor() {
    this.googleAuthPath = 'auth/google';
  }

  async createAuthUrl(): Promise<string> {
    return fetch(formatApiEndpoint(concatPaths(this.googleAuthPath, 'consent'))).then((r) => r.json());
  }

  async exchangeCodeForTokens(code: string): Promise<any> {
    return fetch(
      formatApiEndpoint(concatPaths(this.googleAuthPath, 'tokens')),
      formatRequestOptions({ code })
    ).then((res) => res.json());
  }
}

class FetchTokensError extends Error {}
export class FederatedSigninError extends Error {}

// auth code is retrieved after the user gives consent
export const signinWithGoogleCredentials = async (googleOauth2Controller: GoogleOauth2Controller, googleAuthCode: string) => {
  // user may input random auth code into the url and that will invalidate the request
  let tokens: any;

  try {
    tokens = await googleOauth2Controller.exchangeCodeForTokens(googleAuthCode);
  } catch (err) {
    throw new FetchTokensError(err.message);
  }

  const { id_token, expires_at } = tokens;

  const googleUser: any = jwt_decode(id_token);
  const user = { email: googleUser.email, name: googleUser.name };

  try {
    await onFederatedSignin(UserControllerInstance, UserRegistrationControllerInstance)(
      'google',
      id_token,
      expires_at,
      user
    );
  } catch (err) {
    throw new FederatedSigninError(err.message);
  }
};

const GoogleOauth2ControllerInstance = new GoogleOauth2Controller();

export default GoogleOauth2ControllerInstance;
