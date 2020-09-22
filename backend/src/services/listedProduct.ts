import { RequestHandler } from 'express';

import { formatInsertColumnsQuery, doubleQuotedValue, formatUpdateColumnsQuery } from '../utils/formatDbQuery';

import { ListedProduct, Sneaker, SizeMinPriceGroupType, SneakerAsk, GallerySneaker } from '../../../shared';
import { PromisifiedConnection } from '../config/mysql';
import { LISTED_PRODUCTS, PRODUCTS } from '../config/tables';

class ListedProductService {
  private connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  getAllAsksByNameColorway(nameColorway: string): Promise<SneakerAsk[]> {
    // if the size is not defined, return all asks of the shoes with the name
    const getAllAsksQuery = `
    SELECT size, askingPrice, SUM(A.quantity) as numsAvailable FROM ListedProducts A, Products B 
      WHERE A.prodStatus = "listed" AND A.productId = B.id AND CONCAT(B.name, ' ', B.colorWay) = ${doubleQuotedValue(
        nameColorway
      )}
        GROUP BY askingPrice ORDER BY askingPrice;
    `;

    return this.connection.query(getAllAsksQuery);
  }

  getBySize(size: string) {
    // similar to the get gallery sneakers query, but because the sneakers with different
    // shoe sizes different products, therefore we don't need to group by the name and colorway
    const getBySizeQuery = `
    SELECT name, colorway, brand, imageUrls, B.minPrice FROM ${PRODUCTS} A JOIN (
      SELECT MIN(askingPrice) as minPrice, productId FROM ${LISTED_PRODUCTS} 
      WHERE prodStatus = "listed" GROUP BY productId
    ) B ON A.id = B.productId WHERE size = ${size}`;

    return this.connection.query(getBySizeQuery);
  }

  getGallerySneakers: RequestHandler = async (_req, res, next) => {
    try {
      // get all sneakers grouped by the names and their min price
      const query = `
        SELECT name, size, brand, colorway, imageUrls,
          MIN(B.minAskingPrice) as minPrice FROM ${PRODUCTS} A JOIN (
            SELECT MIN(askingPrice) as minAskingPrice, productId FROM ${LISTED_PRODUCTS}
              WHERE prodStatus = "listed" GROUP BY productId
                ) B ON A.id = B.productId GROUP BY name, colorway`;

      const sneakersWithLowestAskPrice: GallerySneaker[] = await this.connection.query(query);

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
    const query = `
      SELECT A.size, MIN(B.askingPrice) as minPrice FROM ${PRODUCTS} A, ${LISTED_PRODUCTS} B
        WHERE A.id = B.productId AND B.prodStatus = "listed" AND CONCAT(A.name, ' ', A.colorway) = ${doubleQuotedValue(
          name
        )}
         GROUP BY B.productId
    `;

    return this.connection.query(query);
  };

  getAllListedProducts = () => {
    const allListedProductsQuery = `
      SELECT DISTINCT name, brand, colorway, size FROM ${PRODUCTS} P, 
        ${LISTED_PRODUCTS} L WHERE P.id = L.productId AND L.prodStatus = "listed"`;

    return this.connection.query(allListedProductsQuery);
  };

  handleCreate: RequestHandler = async (req, res, next) => {
    const listedProduct: ListedProduct = req.body;

    const createListedProductQuery = formatInsertColumnsQuery(LISTED_PRODUCTS, listedProduct);
    this.connection
      .query(createListedProductQuery)
      .then(() => res.json('Product is listed'))
      .catch(next);
  };

  handlePurchase: RequestHandler = (req, res, next) => {
    const { id, sellerId } = req.body;
    const condition = `userId = ${sellerId} AND id = ${id}`;
    const query = formatUpdateColumnsQuery(LISTED_PRODUCTS, { prodStatus: 'pending' }, condition);

    this.connection
      .query(query)
      .then((result) => res.json(result))
      .catch(next);
  };

  updateProdStatus: RequestHandler = (req, res, next) => {
    const { id } = req.params;
    const prodStatus = req.body;

    this.connection
      .query(formatUpdateColumnsQuery(LISTED_PRODUCTS, prodStatus, `id = ${id}`))
      .then(() => res.json('Product status updated'))
      .catch(next);
  };
}

export default ListedProductService;
