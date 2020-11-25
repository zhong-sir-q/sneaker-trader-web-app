// making requests on behalf of the client
import { Router, Request, Response as ExpResponse, NextFunction } from 'express';
import fetch, { Response as FetchResponse } from 'node-fetch';

type ProxyResponseType = 'json' | 'stream' | 'blob';

const handleRes = (r: FetchResponse, resType: ProxyResponseType) => {
  switch (resType) {
    case 'json':
      return r.json();
    case 'stream':
      return r.body;
    case 'blob':
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
      const data = await fetch(url).then((r) => handleRes(r, res_type as ProxyResponseType));
      res.setHeader('content-type', 'application/octet-stream');
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
