import { Router } from 'express';
import product from './routes/product';
import customer from './routes/customer';
import checkoutSession from './routes/checkoutSession';
import buyingHistory from './routes/buyingHistory';

export default () => {
  const app = Router();
  
  // app will use the following routes as middleware at the respective routes
  product(app);
  customer(app);
  checkoutSession(app);
  buyingHistory(app);

  return app;
};
