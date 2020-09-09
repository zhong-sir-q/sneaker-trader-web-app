import { Router } from 'express';

import product from './routes/product';
import user from './routes/user';
import aws from './routes/aws';
import listedProduct from './routes/listedProduct';
import sellers from './routes/sellers';

export default () => {
  const app = Router();

  // app will use the following routes as middleware at the respective routes
  aws(app);
  product(app);
  listedProduct(app);

  user(app);
  sellers(app);

  return app;
};