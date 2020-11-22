// auth handles 3rd-party authentication services such as Google and Facebook
import { Router, Request, Response, NextFunction } from 'express';

import queryString from 'query-string';
import fetch from 'node-fetch';

function createAuthHandlers() {
  // run gcloud auth application-default login to setup default google credentials

  // more info about google api client on https://googleapis.dev/nodejs/googleapis/latest/oauth2/index.html#oauth2-client
  const client_id = '1021202892438-u553lbg9ns1k2fkluhhscloutqlmn2o7.apps.googleusercontent.com';
  const client_secret = 'GObZWr515UuN2xO_-XPdDx_t';
  const redirect_uri = 'https://localhost:3000/auth/signin';
  const grant_type = 'authorization_code';

  // returns the Credentials object that contains the access_token, id_token and expiry_date etc.
  const exchangeCodeForTokens = async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    let authTokensUrl = 'https://oauth2.googleapis.com/token';

    const params = queryString.stringify({ code, client_id, client_secret, grant_type, redirect_uri });
    authTokensUrl = authTokensUrl + '?' + params;

    try {
      const tokens = await fetch(authTokensUrl, {
        method: 'POST',
      }).then(r => r.json());

      console.log(authTokensUrl)
      console.log(tokens)

      res.json(tokens);
    } catch (err) {
      next(err);
    }
  };

  return { exchangeCodeForTokens };
}

export default function createAuthRoutes() {
  const auth = Router();

  const { exchangeCodeForTokens } = createAuthHandlers();

  auth.route('/google/tokens').post(exchangeCodeForTokens);

  return auth;
}
