import { Sneaker } from '../../../shared';
import { RequestHandler } from 'express';
import { formatInsertColumnsQuery, formateGetColumnsQuery } from '../utils/formatDbQuery';
import { PromisifiedConnection } from '../config/mysql';

class ProductService {
  connection: PromisifiedConnection;
  tableName: string;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
    this.tableName = 'Products';
  }

  async getById(id: number): Promise<Sneaker> {
    const getByIdQuery = formateGetColumnsQuery(this.tableName, `id = ${id}`);

    return (await this.connection.query(getByIdQuery))[0];
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
