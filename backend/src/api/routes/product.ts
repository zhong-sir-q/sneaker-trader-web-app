import { Router } from 'express';
import ProductService from '../../services/product';
import { getMysqlDb } from '../../config/mysql';

const productRoute = Router();

// NOTE: are there too much going on in this funtion? If so, how can I refactor it?
export default (app: Router) => {
  app.use('/product', productRoute);

  productRoute.get('/', (_req, res) => res.send('One product'))

  // create the product in the database
  productRoute.post('/', new ProductService(getMysqlDb()).handleCreate);
};
