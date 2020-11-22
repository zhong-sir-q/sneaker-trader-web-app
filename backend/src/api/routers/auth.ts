// auth handles 3rd-party authentication services such as Google and Facebook
import { Router, Request, Response, NextFunction } from 'express';

import GoogleOauthService from '../../services/external/GoogleOauthService';

function createAuthHandlers(googleOauthService: GoogleOauthService) {
  const createAuthUrl = (_req: Request, res: Response) => res.json(googleOauthService.createAuthUrl());

  // returns the Credentials object that contains the access_token, id_token and expiry_date etc.
  const exchangeCodeForTokens = async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    googleOauthService
      .exchangeCodeForTokens(code)
      .then((tokens) => res.json(tokens))
      .catch((err) => next(err));
  };

  return { createAuthUrl, exchangeCodeForTokens };
}

export default function createAuthRoutes(googleOauthService: GoogleOauthService) {
  const auth = Router();

  const { createAuthUrl, exchangeCodeForTokens } = createAuthHandlers(googleOauthService);

  auth.route('/google/tokens').post(exchangeCodeForTokens);
  auth.route('/google/consent').get(createAuthUrl);

  return auth;
}
