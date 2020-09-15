import { RequestHandler } from 'express';

import { formatInsertColumnsQuery, formateGetColumnsQuery, doubleQuotedValue } from '../utils/formatDbQuery';

import { PromisifiedConnection } from '../config/mysql';

import { Sneaker } from '../../../shared';
import { PRODUCTS } from '../config/tables';

class ProductService {
  connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  getAll: RequestHandler = (_req, res, next) => {
    this.connection
      .query(formateGetColumnsQuery(PRODUCTS))
      .then((result) => res.json(result))
      .catch(next);
  };

  async getByNamecolorwaySize(nameColorway: string, size: number | string) {
    const condition = `CONCAT(name, ' ', colorway) = ${doubleQuotedValue(nameColorway)} AND size = ${size}`;
    const getQuery = formateGetColumnsQuery(PRODUCTS, condition);
    const prod = await this.connection.query(getQuery);

    return prod[0];
  }

  handleCreate: RequestHandler = async (req, res, next) => {
    const product: Omit<Sneaker, 'price'> = req.body;
    const createProductQuery = formatInsertColumnsQuery(PRODUCTS, product);

    this.connection
      .query(createProductQuery)
      .then((queryResult) => res.json(queryResult.insertId))
      .catch(next);
  };
}

export default ProductService;
