import { Router } from 'express';

const productRoute = Router();

// NOTE: are there too much going on in this funtion? If so, how can I refactor it?
export default (app: Router) => {
  app.use('/product', productRoute);

  productRoute.get('/', (_req, res) => res.send('Get one product here'))

  // create the product in the database
  productRoute.post('/');
};
