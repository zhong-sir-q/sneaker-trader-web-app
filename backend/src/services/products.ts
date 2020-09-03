import { formateGetColumnsQuery } from '../utils/formatDbQuery';
import { RequestHandler } from 'express';
import { PromisifiedConnection } from '../config/mysql';

class ProductsService {
  conneciton: PromisifiedConnection;
  tableName: string;

  constructor(conn: PromisifiedConnection) {
    this.conneciton = conn;
    this.tableName = 'Products';
  }

  get: RequestHandler = (_req, res, next) => {
    const getProductsQuery = formateGetColumnsQuery(this.tableName);

    try {
      const products = this.conneciton.query(getProductsQuery);
      res.json(products);
    } catch (err) {
      next(err);
    }
  };
}

export default ProductsService;
