import { Router } from 'express';

import product from './routes/product';
import products from './routes/products';
import customer from './routes/customer';
import refund from './routes/refund';
import buyingHistory from './routes/buyingHistory';
import checkoutSession from './routes/checkoutSession';

export default () => {
  const app = Router();

  // app will use the following routes as middleware at the respective routes
  product(app);
  products(app);
  customer(app);
  refund(app);
  buyingHistory(app);
  checkoutSession(app);

  return app;
};
