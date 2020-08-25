import { Router } from 'express';

import product from './routes/product';
import products from './routes/products';
import user from './routes/user';

export default () => {
  const app = Router();

  // app will use the following routes as middleware at the respective routes
  product(app);
  products(app);
  user(app);

  return app;
};
