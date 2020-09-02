import { Connection } from 'mysql';
import { Sneaker } from '../../../shared';
import { RequestHandler } from 'express';
import { formatInsertColumnsQuery } from '../utils/formatDbQuery';

class ProductService {
  connection: Connection;
  tableName: string;

  constructor(conn: Connection) {
    this.connection = conn;
    this.tableName = 'Products';
  }

  handleCreate: RequestHandler = (req, res, next) => {
    const product: Sneaker = req.body;

    const createProductQuery = formatInsertColumnsQuery(this.tableName, product);

    this.connection.query(createProductQuery, (err, queryResult) => {
      if (err) next(err);
      else res.json(queryResult.insertId);
    });
  };
}

export default ProductService;
