// making requests on behalf of the client
import { Router, Request, Response as ExpResponse, NextFunction } from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';

type ProxyResponseType = 'json' | 'stream' | 'blob';

const handleRes = (r: FetchResponse, expRes: ExpResponse, resType: ProxyResponseType) => {
  switch (resType) {
    case 'json':
      expRes.setHeader('content-type', 'application/json');
      return r.json();
    case 'stream':
      return r.body;
    case 'blob':
      expRes.setHeader('content-type', 'application/octet-stream');
      return r.blob();
    default:
      return null;
  }
};

const createProxyHanlders = () => {
  const post = async (req: Request, res: ExpResponse, next: NextFunction) => {
    const { url } = req.body;
    const { res_type } = req.params;

    try {
      const data = await fetch(url).then((r) => handleRes(r, res, res_type as ProxyResponseType));
      res.send(data);
    } catch (err) {
      next(err);
    }
  };

  return { post };
};

const createProxyRoutes = () => {
  const proxyRoute = Router();

  const { post: proxyPost } = createProxyHanlders();

  proxyRoute.route('/:res_type').post(proxyPost);

  return { router: proxyRoute };
};

export default createProxyRoutes;
