import { formatInsertColumnsQuery, doubleQuotedValue, formatUpdateColumnsQuery } from '../utils/formatDbQuery';

import {
  ListedProduct,
  SizeMinPriceGroupType,
  SneakerAsk,
  GallerySneaker,
  AppSneaker,
  SellerListedSneaker,
} from '../../../shared';
import mysqlPoolConnection, {  } from '../config/mysql';
import { LISTED_PRODUCTS, PRODUCTS } from '../config/tables';
import ListedSneakerEntity from '../../../shared/@types/domains/entities/ListedSneakerEntity';
import { getBuyersAvgRatingQuery } from '../utils/queries';

class ListedSneakerService implements ListedSneakerEntity {
  async getAllAsksByNameColorway(nameColorway: string): Promise<SneakerAsk[]> {
    const poolConn = await mysqlPoolConnection();
    // if the size is not defined, return all asks of the shoes with the name
    const getAllAsksQuery = `
    SELECT size, askingPrice, SUM(A.quantity) as numsAvailable FROM ListedProducts A, Products B 
      WHERE A.prodStatus = "listed" AND A.productId = B.id AND CONCAT(B.name, ' ', B.colorWay) = ${doubleQuotedValue(
        nameColorway
      )}
        GROUP BY askingPrice ORDER BY askingPrice;
    `;

    return poolConn.query(getAllAsksQuery);
  }

  async getBySellerId(sellerId: number): Promise<SellerListedSneaker[]> {
    const poolConn = await mysqlPoolConnection();

    const getBuyersInfo = `
      SELECT email, name, username, phoneNo, U.id as userId FROM
        Transactions T, Users U WHERE listedProductId = L.id AND T.buyerId = U.id
    `;

    const getBuyerQuery = `
      SELECT JSON_OBJECT("email", email, "username", username, 
      "phoneNo", phoneNo, "buyerRating", buyerRating)
        FROM ( ${getBuyersInfo} ) q1 LEFT JOIN
          ( ${getBuyersAvgRatingQuery('buyerRating')} ) q2
            ON q1.userId = q2.buyerId
    `;

    const buyerIfPendingOrSoldProduct = `
      IF(prodStatus = 'pending' OR prodStatus = 'sold', 
        (${getBuyerQuery}), null) AS stringifiedBuyer`;

    const getSellerListedProductsQuery = `
      SELECT L.id, L.sizeSystem, imageUrls, name, brand, colorway, size, prodStatus, ${buyerIfPendingOrSoldProduct},
        askingPrice as price, quantity FROM ListedProducts L, Products P
          WHERE L.userId = ${sellerId} AND L.productId = P.id
    `;

    const queryResult = await poolConn.query(getSellerListedProductsQuery);

    for (const sneaker of queryResult) {
      sneaker.buyer = JSON.parse(sneaker.stringifiedBuyer);
      delete sneaker.stringifiedBuyer;
    }

    return queryResult;
  }

  async getGallerySneakersBySize(size: number): Promise<GallerySneaker[]> {
    const poolConn = await mysqlPoolConnection();

    // similar to the get gallery sneakers query, but because the sneakers with different
    // shoe sizes different products, therefore we don't need to group by the name and colorway
    const getBySizeQuery = `
    SELECT name, colorway, brand, imageUrls, B.minPrice FROM ${PRODUCTS} A JOIN (
      SELECT MIN(askingPrice) as minPrice, productId FROM ${LISTED_PRODUCTS} 
      WHERE prodStatus = "listed" GROUP BY productId
    ) B ON A.id = B.productId WHERE size = ${size}`;

    return poolConn.query(getBySizeQuery);
  }

  async getGallerySneakers(): Promise<GallerySneaker[]> {
    // get all sneakers grouped by the names and their min price
    const query = `
    SELECT name, size, brand, colorway, imageUrls,
      MIN(B.minAskingPrice) as minPrice FROM ${PRODUCTS} A JOIN (
        SELECT MIN(askingPrice) as minAskingPrice, productId FROM ${LISTED_PRODUCTS}
          WHERE prodStatus = "listed" GROUP BY productId
            ) B ON A.id = B.productId GROUP BY name, colorway`;

    const poolConn = await mysqlPoolConnection();
    const sneakersWithLowestAskPrice = await poolConn.query(query);

    return sneakersWithLowestAskPrice;
  }

  /**
   * @param name space separated name, e.g. Kobe 4 Black
   */
  getSizeMinPriceGroupByName = async (name: string): Promise<SizeMinPriceGroupType> => {
    const poolConn = await mysqlPoolConnection();

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

    return poolConn.query(query);
  };

  async getAllListedSneakers(): Promise<AppSneaker[]> {
    const poolConn = await mysqlPoolConnection();

    const allListedProductsQuery = `
      SELECT DISTINCT name, brand, colorway, size FROM ${PRODUCTS} P, 
        ${LISTED_PRODUCTS} L WHERE P.id = L.productId AND L.prodStatus = "listed"`;

    return poolConn.query(allListedProductsQuery);
  }

  async create(listedSneaker: ListedProduct) {
    const poolConn = await mysqlPoolConnection();
    const createListedProductQuery = formatInsertColumnsQuery(LISTED_PRODUCTS, listedSneaker);

    return poolConn.query(createListedProductQuery);
  }

  async handlePurchase(listedSneakerId: number, sellerId: number) {
    const poolConn = await mysqlPoolConnection();

    const condition = `userId = ${sellerId} AND id = ${listedSneakerId}`;
    const query = formatUpdateColumnsQuery(LISTED_PRODUCTS, { prodStatus: 'pending' }, condition);

    return poolConn.query(query);
  }

  async updateListedSneakerStatus(listedSneakerId: number, listedSneakerStatus: Pick<ListedProduct, 'prodStatus'>) {
    const poolConn = await mysqlPoolConnection();

    return poolConn.query(formatUpdateColumnsQuery(LISTED_PRODUCTS, listedSneakerStatus, `id = ${listedSneakerId}`));
  }
}

export default ListedSneakerService;
