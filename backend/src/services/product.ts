import { RequestHandler } from 'express';

import { formatInsertColumnsQuery, formateGetColumnsQuery, doubleQuotedValue } from '../utils/formatDbQuery';

import { PromisifiedConnection } from '../config/mysql';

import { DomainSneaker } from '../../../shared';
import { PRODUCTS } from '../config/tables';

class ProductService {
  connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  async getByNamecolorwaySize(nameColorway: string, size: number | string) {
    const condition = `CONCAT(name, ' ', colorway) = ${doubleQuotedValue(nameColorway)} AND size = ${size}`;
    const getQuery = formateGetColumnsQuery(PRODUCTS, condition);
    const prod = await this.connection.query(getQuery);

    // has to be null instead of undefined
    // otherwise the app cannot deserialize it for some reason
    return prod.length === 1 ? prod[0] : null;
  }

  handleCreate: RequestHandler = async (req, res, next) => {
    const product: DomainSneaker = req.body;
    const createProductQuery = formatInsertColumnsQuery(PRODUCTS, product);

    this.connection
      .query(createProductQuery)
      .then((queryResult) => res.json(queryResult.insertId))
      .catch(next);
  };
}

export default ProductService;
