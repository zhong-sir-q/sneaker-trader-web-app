import { Connection } from 'mysql';
import { formateGetColumnsQuery } from '../utils/formatDbQuery';
import { RequestHandler } from 'express';

class ProductsService {
  conneciton: Connection;
  tableName: string;

  constructor(conn: Connection) {
    this.conneciton = conn;
    this.tableName = 'Products';
  }

  get: RequestHandler = (req, res, next) => {
    const getAllColumnsQuery = formateGetColumnsQuery(this.tableName);

    this.conneciton.query(getAllColumnsQuery, (err, queryResult) => {
      if (err) next(err);
      else res.json(queryResult);
    });
  };
}

export default ProductsService;
