import { Sneaker } from '../../../shared';
import { RequestHandler } from 'express';
import { formatInsertColumnsQuery, formateGetColumnsQuery } from '../utils/formatDbQuery';
import { FetchDbDataCallback } from '../@types/utils';
import { PromisifiedConnection } from '../config/mysql';

class ProductService {
  connection: PromisifiedConnection;
  tableName: string;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
    this.tableName = 'Products';
  }

  getById(id: number, cb: FetchDbDataCallback) {
    const getByIdQuery = formateGetColumnsQuery(this.tableName, `id = ${id}`);
  }

  handleCreate: RequestHandler = async (req, res, next) => {
    const product: Sneaker = req.body;

    const createProductQuery = formatInsertColumnsQuery(this.tableName, product);

    try {
      const { insertId } = await this.connection.query(createProductQuery);
      res.json(insertId);
    } catch (err) {
      next(err);
    }
  };
}

export default ProductService;
