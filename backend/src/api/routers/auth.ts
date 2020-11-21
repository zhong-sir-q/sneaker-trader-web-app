// auth handles 3rd-party authentication services such as Google and Facebook
import { Router, Request, Response, NextFunction } from 'express';

import { google } from 'googleapis';

function createAuthHandlers() {
  // run gcloud auth application-default login to setup default google credentials

  // more info about google api client on https://googleapis.dev/nodejs/googleapis/latest/oauth2/index.html#oauth2-client
  const auth = new google.auth.GoogleAuth();

  const askConsent = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const authClient = await auth.getClient();

      const consentUrl = authClient.generateAuthUrl({
        redirect_uri: 'https://localhost:3000',
        scope: [
          'openid',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ],
        access_type: 'offline',
      });

      res.json(consentUrl);
    } catch (e) {
      next(e);
    }
  };

  // returns the Credentials object that contains the access_token, id_token and expiry_date etc.
  const exchangeCodeForToken = async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    try {
      const authClient = await auth.getClient();

      const { tokens } = await authClient.getToken(code);
      res.json(tokens);
    } catch (e) {
      next(e);
    }
  };

  return { askConsent, exchangeCodeForToken };
}

export default function createAuthRoutes() {
  const auth = Router();

  const { askConsent, exchangeCodeForToken } = createAuthHandlers();

  auth.route('/google/consent').get(askConsent);

  auth.route('/google/tokens').post(exchangeCodeForToken);

  return auth;
}
