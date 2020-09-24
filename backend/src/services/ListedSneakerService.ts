import { formatInsertColumnsQuery, doubleQuotedValue, formatUpdateColumnsQuery } from '../utils/formatDbQuery';

import { ListedProduct, SizeMinPriceGroupType, SneakerAsk, GallerySneaker, AppSneaker, SellerListedSneaker } from '../../../shared';
import { PromisifiedConnection, getMysqlDb } from '../config/mysql';
import { LISTED_PRODUCTS, PRODUCTS } from '../config/tables';
import ListedSneakerUseCase from '../../../shared/@types/domains/usecases/ListedSneakerUseCase';
import { getBuyersAvgRatingQuery } from '../utils/queries';

class ListedSneakerService implements ListedSneakerUseCase {
  private connection: PromisifiedConnection;

  constructor() {
    this.connection = getMysqlDb();
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

  async getBySellerId(sellerId: number): Promise<SellerListedSneaker[]> {
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
      SELECT L.id, imageUrls, name, colorway, size, prodStatus, ${buyerIfPendingOrSoldProduct},
        askingPrice as price, quantity FROM ListedProducts L, Products P
          WHERE L.userId = ${sellerId} AND L.productId = P.id
    `;

    const queryResult = await this.connection.query(getSellerListedProductsQuery);

    for (const sneaker of queryResult) {
      sneaker.buyer = JSON.parse(sneaker.stringifiedBuyer);
      delete sneaker.stringifiedBuyer;
    }

    return queryResult;
  }

  getBySize(size: string): Promise<GallerySneaker> {
    // similar to the get gallery sneakers query, but because the sneakers with different
    // shoe sizes different products, therefore we don't need to group by the name and colorway
    const getBySizeQuery = `
    SELECT name, colorway, brand, imageUrls, B.minPrice FROM ${PRODUCTS} A JOIN (
      SELECT MIN(askingPrice) as minPrice, productId FROM ${LISTED_PRODUCTS} 
      WHERE prodStatus = "listed" GROUP BY productId
    ) B ON A.id = B.productId WHERE size = ${size}`;

    return this.connection.query(getBySizeQuery);
  }

  async getGallerySneakers(): Promise<GallerySneaker[]> {
    // get all sneakers grouped by the names and their min price
    const query = `
    SELECT name, size, brand, colorway, imageUrls,
      MIN(B.minAskingPrice) as minPrice FROM ${PRODUCTS} A JOIN (
        SELECT MIN(askingPrice) as minAskingPrice, productId FROM ${LISTED_PRODUCTS}
          WHERE prodStatus = "listed" GROUP BY productId
            ) B ON A.id = B.productId GROUP BY name, colorway`;

    const sneakersWithLowestAskPrice: GallerySneaker[] = await this.connection.query(query);

    return sneakersWithLowestAskPrice;
  }

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

  getAllListedSneakers(): Promise<AppSneaker[]> {
    const allListedProductsQuery = `
      SELECT DISTINCT name, brand, colorway, size FROM ${PRODUCTS} P, 
        ${LISTED_PRODUCTS} L WHERE P.id = L.productId AND L.prodStatus = "listed"`;

    return this.connection.query(allListedProductsQuery);
  }

  handleCreate(listedSneaker: ListedProduct) {
    const createListedProductQuery = formatInsertColumnsQuery(LISTED_PRODUCTS, listedSneaker);
    return this.connection.query(createListedProductQuery);
  }

  handlePurchase(listedSneakerId: number, sellerId: number) {
    const condition = `userId = ${sellerId} AND id = ${listedSneakerId}`;
    const query = formatUpdateColumnsQuery(LISTED_PRODUCTS, { prodStatus: 'pending' }, condition);

    return this.connection.query(query);
  }

  // TODO: need to confirm the implementations here
  updateListedSneakerStatus(listedSneakerId: number, listedSneakerStatus: Pick<ListedProduct, 'prodStatus'>) {

    return this.connection
      .query(formatUpdateColumnsQuery(LISTED_PRODUCTS, listedSneakerStatus, `id = ${listedSneakerId}`))
  }
}

export default ListedSneakerService;
