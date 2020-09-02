import { Router } from 'express';
import ListedProductService from '../../services/listedProduct';
import { getMysqlDb } from '../../config/mysql';

const listedProductRoute = Router();

export default (app: Router) => {
  app.use('/listed_product', listedProductRoute);

  // create the product in the database
  listedProductRoute.post('/', new ListedProductService(getMysqlDb()).handleCreate);
};
