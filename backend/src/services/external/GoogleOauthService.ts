import GoogleOauthEntity from '../../../../shared/@types/domains/entities/GoogleOauthEntity';
import config from '../../config';
import { google } from 'googleapis';

const { client_id, client_secret, redirect_uri } = config.googleOauth2;
// more info about google api client on https://googleapis.dev/nodejs/googleapis/latest/oauth2/index.html#oauth2-client
const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

const scopes = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

// run gcloud auth application-default login to setup default google credentials
class GoogleOauthService implements GoogleOauthEntity {
  createAuthUrl(): string {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
  }

  // returns the Credentials object that contains the access_token, id_token and expiry_date etc.
  async exchangeCodeForTokens(code: string): Promise<any> {
    const { tokens } = await oauth2Client.getToken(code);

    return tokens;
  }
}

export default GoogleOauthService;
