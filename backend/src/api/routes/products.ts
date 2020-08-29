import { Router } from 'express';

const productsRoute = Router();

export default (app: Router) => {
  app.use('/products', productsRoute);
};
