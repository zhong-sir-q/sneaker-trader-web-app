import { Router } from 'express';
import ProductService from '../../services/product';
import { getMysqlDb } from '../../config/mysql';

const productsRoute = Router();

export default (app: Router) => {
  app.use('/products', productsRoute);

  productsRoute.get('/', (_req, res) => {
    const mySqlConnection = getMysqlDb();
    const ProductServiceInstance = new ProductService(mySqlConnection);

    ProductServiceInstance.getAllProducts((err, queryResult) => {
      if (err) throw new Error(`Error fetching all products: ${err.message}`);
      else res.json({ products: queryResult });
    });
  });
};
