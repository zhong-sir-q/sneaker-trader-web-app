import { Router } from 'express';

import product from './routes/product';
import products from './routes/products';

export default () => {
  const app = Router();

  // app will use the following routes as middleware at the respective routes
  product(app);
  products(app);

  return app;
};
