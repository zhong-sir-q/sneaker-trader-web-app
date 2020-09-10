import { RequestHandler } from 'express';

import {
  formatInsertColumnsQuery,
  formateGetColumnsQuery,
  formatUpdateColumnsQuery,
  doubleQuotedValue,
} from '../utils/formatDbQuery';

import { PromisifiedConnection } from '../config/mysql';

import { Sneaker } from '../../../shared';
import { PRODUCTS } from '../config/tables';

class ProductService {
  connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  // a function that gets the product based on general conditions
  async getByCondition(condition?: string): Promise<Sneaker> {
    const getQuery = formateGetColumnsQuery(PRODUCTS, condition);
    const result = await this.connection.query(getQuery);

    return result[0];
  }

  async updatePrice(price: number, id: number) {
    const updatePriceQuery = formatUpdateColumnsQuery(PRODUCTS, { price }, `id = ${id}`);

    try {
      await this.connection.query(updatePriceQuery);
    } catch (err) {
      // rollback transactions here
    }
  }

  // return -1 if not exist else return its product id
  private async productExists(name: string, colorway: string, size: number) {
    const condition = `CONCAT(name, ' ', colorway) = ${doubleQuotedValue(`${name} ${colorway}`)} AND size = ${size}`;
    const productExistsQuery = formateGetColumnsQuery(PRODUCTS, condition);
    const result = await this.connection.query(productExistsQuery);

    return result.length == 0 ? -1 : result[0].id
  }

  handleCreate: RequestHandler = async (req, res, next) => {
    const product: Sneaker = req.body;

    const createProductQuery = formatInsertColumnsQuery(PRODUCTS, product);

    try {
      const idIfExists = await this.productExists(product.name, product.colorway, product.size as number)
      if (idIfExists > -1) {
        res.json(idIfExists)
        return
      }

      const { insertId } = await this.connection.query(createProductQuery);
      res.json(insertId);
    } catch (err) {
      next(err);
    }
  };
}

export default ProductService;
