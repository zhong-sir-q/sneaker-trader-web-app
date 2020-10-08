import { Router } from 'express';
import fetch from 'node-fetch';
import { CreatePoliLinkPayload } from '../../../../shared';
import config from '../../config';

const poliRoute = Router();
const POLI_BASE_API = 'https://poliapi.apac.paywithpoli.com/api';

export default (app: Router) => {
  app.use('/poli', poliRoute);

  poliRoute.post('/poliLink/create', async (req, res, next) => {
    const createLinkReq: CreatePoliLinkPayload = req.body;

    try {
      const poliLinkUrl = await fetch(`${POLI_BASE_API}/POLiLink/Create`, {
        method: 'POST',
        body: JSON.stringify(createLinkReq),
        headers: {
          Authorization: `Basic ${config.poliAuthKey}`,
          'Content-Type': 'application/json',
        },
      }).then(r => r.json());

      res.json(poliLinkUrl);
    } catch (err) {
      next(err);
    }
  });
};
