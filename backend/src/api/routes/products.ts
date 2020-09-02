import { Router } from 'express';
import ProductsService from '../../services/products';
import { getMysqlDb } from '../../config/mysql';

const productsRoute = Router();

export default (app: Router) => {
  app.use('/products', productsRoute);

  productsRoute.get('/', new ProductsService(getMysqlDb()).get);
};
