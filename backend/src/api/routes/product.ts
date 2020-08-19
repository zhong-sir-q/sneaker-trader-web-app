import { Router } from 'express';

const productRoute = Router();

// NOTE: are there too much going on in this funtion? If so, how can I refactor it?
export default (app: Router) => {
  app.use('/product', productRoute);

  // create the product in the database
  productRoute.post('/');
};
