import { Sneaker } from '../../../shared';
import { RequestHandler } from 'express';
import { formatInsertColumnsQuery, formateGetColumnsQuery, formatUpdateColumnsQuery } from '../utils/formatDbQuery';
import { PromisifiedConnection } from '../config/mysql';

class ProductService {
  connection: PromisifiedConnection;
  tableName: string;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
    this.tableName = 'Products';
  }

  // a function that gets the product based on general conditions
  async getByCondition(condition?: string): Promise<Sneaker> {
    const getQuery = formateGetColumnsQuery(this.tableName, condition);
    const result = await this.connection.query(getQuery);

    return result[0];
  }

  async updatePrice(price: number, id: number) {
    const updatePriceQuery = formatUpdateColumnsQuery(this.tableName, { price }, `id = ${id}`)

    try {
      await this.connection.query(updatePriceQuery)
    } catch (err) {
      // rollback transactions here
    }
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
