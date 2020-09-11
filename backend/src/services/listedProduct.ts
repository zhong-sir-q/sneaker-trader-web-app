import { RequestHandler } from 'express';

import ProductService from './product';

import {
  formatInsertColumnsQuery,
  doubleQuotedValue,
} from '../utils/formatDbQuery';

import { ListedProduct, Sneaker, SizeMinPriceGroupType } from '../../../shared';
import { PromisifiedConnection } from '../config/mysql';
import { LISTED_PRODUCTS, PRODUCTS } from '../config/tables';

class ListedProductService {
  private connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  getBySize(size: string): Promise<Sneaker[]> {
    // similar to the get gallery sneakers query, but because the sneakers with different
    // shoe sizes different products, therefore we don't need to group by the name and colorway
    const getBySizeQuery = `
    SELECT name, colorway, brand, imageUrls, B.price FROM ${PRODUCTS} A JOIN (
      SELECT MIN(askingPrice) as price, productId FROM ${LISTED_PRODUCTS} 
      WHERE sold = 0 GROUP BY productId
    ) B ON A.id = B.productId WHERE size = ${size}`;

    return this.connection.query(getBySizeQuery);
  }

  getGallerySneakers: RequestHandler = async (_req, res, next) => {
    try {
      // get all sneakers grouped by the names and their min price
      const query = `SELECT name, size, brand, colorway, imageUrls,
              MIN(B.minAskingPrice) as price FROM ${PRODUCTS} A JOIN (
              SELECT MIN(askingPrice) as minAskingPrice, productId FROM ${LISTED_PRODUCTS}
              WHERE sold = 0 GROUP BY productId
            ) B ON A.id = B.productId GROUP BY name, colorway`;

      const sneakersWithLowestAskPrice: Sneaker[] = await this.connection.query(query);

      res.json(sneakersWithLowestAskPrice);
    } catch (err) {
      next(err);
    }
  };

  /**
   * @param name space separated name, e.g. Kobe 4 Black
   */
  getSizeMinPriceGroupByName = async (name: string): Promise<SizeMinPriceGroupType> => {
    /**
     * NOTE: here are the BUGS I experenced
     * - the result column name query does not match the type definition, hence the client
     * will recieve undefeind values
     * - incorrect punctuations, e.g. A,id instead of A.id
     */

    // get the size and the minium price of each listedProduct
    // with distinct product id that are not sold
    const query = `
      SELECT A.size, MIN(B.askingPrice) as minPrice FROM ${PRODUCTS} A, ${LISTED_PRODUCTS} B
        WHERE A.id = B.productId AND B.sold = 0 AND CONCAT(A.name, ' ', A.colorway) = ${doubleQuotedValue(name)}
         GROUP BY B.productId
    `;

    return this.connection.query(query);
  };

  getAllListedProducts = () => {
    const allListedProductsQuery = `
      SELECT DISTINCT name, brand, colorway, size FROM ${PRODUCTS} A, 
        ${LISTED_PRODUCTS} B WHERE A.id = B.productId AND B.sold = 0`;

    return this.connection.query(allListedProductsQuery);
  };

  handleCreate: RequestHandler = async (req, res, next) => {
    const listedProduct: ListedProduct = req.body;
    const { productId, askingPrice } = listedProduct;

    const createListedProductQuery = formatInsertColumnsQuery(LISTED_PRODUCTS, listedProduct);

    try {
      const result = await this.connection.query(createListedProductQuery);

      const ProductServiceInstance = new ProductService(this.connection);

      // NOTE: what is point of having the price column in the Products table?
      // My assumption below is that the value of the price column represents
      // the minimum price of that specific product
      const product = await ProductServiceInstance.getByCondition(`id = ${productId}`);

      if (askingPrice < product.price) ProductServiceInstance.updatePrice(askingPrice, productId);

      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

export default ListedProductService;
