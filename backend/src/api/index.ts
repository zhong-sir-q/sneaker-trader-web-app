import { Router } from 'express';

import user from './routes/user';
import sellers from './routes/sellers';

import product from './routes/product';
import listedProduct from './routes/listedProduct';

import aws from './routes/aws';

import helperInfo from './routes/helperInfo';

export default () => {
  const app = Router();

  // app will use the following routes as middleware at the respective routes
  aws(app);
  product(app);
  listedProduct(app);

  user(app);
  sellers(app);
  helperInfo(app)

  return app;
};
