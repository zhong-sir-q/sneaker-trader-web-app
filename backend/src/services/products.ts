import { formateGetColumnsQuery } from '../utils/formatDbQuery';
import { RequestHandler } from 'express';
import { PromisifiedConnection } from '../config/mysql';
import { Sneaker } from '../../../shared';

class ProductsService {
  conneciton: PromisifiedConnection;
  tableName: string;

  constructor(conn: PromisifiedConnection) {
    this.conneciton = conn;
    this.tableName = 'Products';
  }

  async getByCondition(condition?: string): Promise<Sneaker[]> {
    const getQuery = formateGetColumnsQuery(this.tableName, condition)

    return this.conneciton.query(getQuery)
  }

  get: RequestHandler = async (_req, res, next) => {
    try {
      const products = await this.getByCondition()

      res.json(products);
    } catch (err) {
      next(err);
    }
  };
}

export default ProductsService;
