import { RequestHandler } from 'express';
import { ListedProduct, Sneaker, SizeMinPriceGroupType } from '../../../shared';
import { formatInsertColumnsQuery, doubleQuotedValue } from '../utils/formatDbQuery';
import { PromisifiedConnection } from '../config/mysql';
import ProductService from './product';

class ListedProductService {
  private connection: PromisifiedConnection;
  private tableName: string;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
    this.tableName = 'ListedProducts';
  }

  getBySize(size: string): Promise<Sneaker[]> {
    // similar to the get gallery sneakers query, but because the sneakers with different
    // shoe sizes different products, therefore we don't need to group by the name and colorWay
    const getBySizeQuery = `
    SELECT name, colorWay, brand, imageUrls, B.price FROM Products A JOIN (
      SELECT MIN(askingPrice) as price, productId FROM ${this.tableName} 
      WHERE sold = 0 GROUP BY productId
    ) B ON A.id = B.productId WHERE size = ${size}`

    return this.connection.query(getBySizeQuery)
  }

  getGallerySneakers: RequestHandler = async (_req, res, next) => {
    try {
      // get all sneakers grouped by the names and their min price
      const query = `SELECT name, size, brand, colorWay, imageUrls,
              MIN(B.minAskingPrice) as price FROM Products A JOIN (
              SELECT MIN(askingPrice) as minAskingPrice, productId FROM ${this.tableName}
              WHERE sold = 0 GROUP BY productId
            ) B ON A.id = B.productId GROUP BY name, colorWay`;

      const lowestAskedSneakers: Sneaker[] = await this.connection.query(query);

      res.json(lowestAskedSneakers);
    } catch (err) {
      next(err);
    }
  };

  /**
   * @param name space separated name, e.g. Kobe 4 Black
   */
  getSizeMinPriceGroupByName = async (name: string): Promise<SizeMinPriceGroupType> => {
    // get the size and the minium price of each listedProduct
    // with distinct product id that are not sold

    /**
     * NOTE: here are the BUGS I experenced
     * - the result column name query does not match the type definition, hence the client
     * will recieve undefeind values
     * - incorrect punctuations, e.g. A,id instead of A.id
     */
    const query = `SELECT A.size, B.minPrice FROM Products AS A LEFT JOIN (
        SELECT MIN(askingPrice) as minPrice, productId FROM ${this.tableName}
        WHERE sold = 0 GROUP BY productId
      ) AS B ON A.id = B.productId WHERE CONCAT(A.name, ' ', A.colorWay) = ${doubleQuotedValue(name)}`;

    return this.connection.query(query);
  };

  getAllListedProducts = () => {
    const allListedProductsQuery = 
      `SELECT DISTINCT name, brand, colorWay, size FROM Products A INNER JOIN
        ListedProducts B ON A.id = B.productId WHERE B.sold = 0`

    return this.connection.query(allListedProductsQuery)
  }

  handleCreate: RequestHandler = async (req, res, next) => {
    const listedProduct: ListedProduct = req.body;
    const createProductQuery = formatInsertColumnsQuery(this.tableName, listedProduct);

    try {
      // TODO: update the minimum price of the product after the successful query
      const result = await this.connection.query(createProductQuery);
      const ProductServiceInstance = new ProductService(this.connection);

      const { productId, askingPrice } = listedProduct;

      const product = await ProductServiceInstance.getByCondition(`id = ${productId}`);
      if (askingPrice < product.price!) ProductServiceInstance.updatePrice(askingPrice, productId);

      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

export default ListedProductService;
