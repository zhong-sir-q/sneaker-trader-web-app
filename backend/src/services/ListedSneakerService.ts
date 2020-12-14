import { formatInsertRowsQuery, doubleQuotedValue, formatUpdateRowsQuery } from '../utils/formatDbQuery';

import {
  ListedProduct,
  SizeMinPriceGroupType,
  SneakerAsk,
  GallerySneaker,
  SellerListedSneaker,
  CreateListedSneakerPayload,
  GetListedSneaker,
} from '../../../shared';

import ListedSneakerEntity from '../../../shared/@types/domains/entities/ListedSneakerEntity';

import { PromisifiedPool } from '../config/mysql';
import { LISTED_PRODUCTS, PRODUCTS } from '../config/tables';
import { getBuyersAvgRatingQuery } from '../utils/queries';

class ListedSneakerService implements ListedSneakerEntity {
  private conn: PromisifiedPool;

  constructor(connection: PromisifiedPool) {
    this.conn = connection;
  }

  // get all sneaker asks along with the min asking price of each size the
  // the available numbers
  async getAllAsksByNameColorway(name: string, colorway: string): Promise<SneakerAsk[]> {
    const getAllAsksQuery = `
      SELECT size, Min(askingPrice) as askingPrice, SUM(L.quantity) as numsAvailable
        FROM ListedProducts L, Products P
          WHERE L.prodStatus = "listed" AND L.productId = P.id
            AND P.name = ? AND P.colorway = ?
              GROUP BY size ORDER BY askingPrice;
    `;

    return this.conn.query(getAllAsksQuery, [name, colorway]);
  }

  async getBySellerId(sellerId: number): Promise<SellerListedSneaker[]> {
    const getBuyersInfo = `
      SELECT id, email, name, username, phoneNo, profilePicUrl, U.id as userId, transactionDatetime,
        IF(T.buyerRatingFromSeller > 0, 1, 0) AS hasSellerRatedBuyer FROM
          Transactions T, Users U WHERE listedProductId = L.id AND T.buyerId = U.id
    `;

    const getBuyerQuery = `
      SELECT JSON_OBJECT("id", id, "email", email, "username", username, 
      "phoneNo", phoneNo, "buyerRating", buyerRating, "profilePicUrl", profilePicUrl,
      "transactionDatetime", transactionDatetime, "hasSellerRatedBuyer", hasSellerRatedBuyer)
        FROM ( ${getBuyersInfo} ) q1 LEFT JOIN
          ( ${getBuyersAvgRatingQuery('buyerRating')} ) q2
            ON q1.userId = q2.buyerId
    `;

    const buyerIfPendingOrSoldProduct = `
      IF(prodStatus = 'pending' OR prodStatus = 'sold',
        (${getBuyerQuery}), null) AS stringifiedBuyer`;

    const getSellerListedProductsQuery = `
      SELECT L.*, name, brand, colorway, size, listedDatetime, ${buyerIfPendingOrSoldProduct},
        askingPrice as price, quantity FROM ListedProducts L, Products P
          WHERE L.userId = ${sellerId} AND L.productId = P.id
            ORDER BY JSON_EXTRACT(stringifiedBuyer, '$.transactionDatetime') DESC
    `;

    const sellerListedSneakers = await this.conn.query(getSellerListedProductsQuery);

    if (!sellerListedSneakers) return [];

    for (const sneaker of sellerListedSneakers) {
      sneaker.buyer = JSON.parse(sneaker.stringifiedBuyer);
      delete sneaker.stringifiedBuyer;
    }

    return sellerListedSneakers;
  }

  // return all sneakers with no duplicates, they are duplicates if they have the same name, colorway, brand
  async getAll() {
    const query = `
      SELECT name, brand, colorway, P.imageUrls FROM ${PRODUCTS} P,
        ${LISTED_PRODUCTS} L WHERE P.id = L.productId
          GROUP BY name, brand, colorway`;

    return this.conn.query(query);
  }

  async getGallerySneakersBySize(sellerId: number, size: number): Promise<GallerySneaker[]> {
    // similar to the get gallery sneakers query, but because the sneakers with different
    // shoe sizes different products, therefore we don't need to group by the name and colorway
    const getBySizeQuery = `
    SELECT name, colorway, brand, size, P.imageUrls, minPrice, mainDisplayImage FROM ${PRODUCTS} P JOIN (
      SELECT MIN(askingPrice) as minPrice, productId, mainDisplayImage FROM ${LISTED_PRODUCTS}
      WHERE prodStatus = "listed" AND NOT userId = ${sellerId} GROUP BY productId
    ) L ON P.id = L.productId WHERE size = ${size}`;

    return this.conn.query(getBySizeQuery);
  }

  async getGallerySneakers(sellerId: number, limit?: number, offset?: number): Promise<GallerySneaker[]> {
    // get all sneakers grouped by the names and their min price
    let query = `
      SELECT name, size, brand, colorway, P.imageUrls,
        MIN(minAskingPrice) as minPrice, mainDisplayImage FROM ${PRODUCTS} P JOIN (
          SELECT MIN(askingPrice) as minAskingPrice, productId, mainDisplayImage FROM ${LISTED_PRODUCTS}
            WHERE prodStatus = "listed" AND NOT userId = ${sellerId} GROUP BY productId
              ) L ON P.id = L.productId GROUP BY name, colorway`;

    let constraint = '';
    if (limit) constraint = `LIMIT ${limit}`;
    if (offset) constraint = `${constraint} OFFSET ${offset}`;

    query = query + ' ' + constraint;
    const sneakersWithLowestAskPrice = await this.conn.query(query);

    return sneakersWithLowestAskPrice;
  }

  /**
   * @param nameColorway space separated name, e.g. Kobe 4 Black
   */
  getSizeMinPriceGroupByNameColorway = async (
    name: string,
    colorway: string,
    sellerId: number
  ): Promise<SizeMinPriceGroupType> => {
    /**
     * NOTE: here are the BUGS I experenced
     * - the result column name query does not match the type definition, hence the client
     * will recieve undefeind values
     * - incorrect punctuations, e.g. A,id instead of A.id
     */

    // get the size and the minium price of each listedProduct

    // group by product id because we expect there is only one
    // pair of sneakers with the same name colorway and size
    const query = `
      SELECT P.size, MIN(L.askingPrice) as minPrice FROM ${PRODUCTS} P, ${LISTED_PRODUCTS} L
        WHERE P.id = L.productId AND L.prodStatus = "listed" AND NOT L.userId = ? AND
          P.name = ? AND P.colorway = ? GROUP BY P.id
    `;

    return this.conn.query(query, [sellerId, name, colorway]);
  };

  async getAllListedSneakers(): Promise<GetListedSneaker[]> {
    const allListedProductsQuery = `
      SELECT L.*, name, brand, colorway, size FROM ${PRODUCTS} P,
        ${LISTED_PRODUCTS} L WHERE P.id = L.productId AND L.prodStatus = 'listed'
          GROUP BY productId`;

    return this.conn.query(allListedProductsQuery);
  }

  async create(listedSneaker: CreateListedSneakerPayload) {
    const createListedProductQuery = formatInsertRowsQuery(LISTED_PRODUCTS, listedSneaker);
    const res = await this.conn.query(createListedProductQuery);

    return res.insertId;
  }

  async handlePurchase(listedSneakerId: number, sellerId: number) {
    const condition = `userId = ${sellerId} AND id = ${listedSneakerId}`;
    const query = formatUpdateRowsQuery(LISTED_PRODUCTS, { prodStatus: 'pending' }, condition);

    return this.conn.query(query);
  }

  async updateListedSneakerStatus(listedSneakerId: number, listedSneakerStatus: Pick<ListedProduct, 'prodStatus'>) {
    return this.conn.query(formatUpdateRowsQuery(LISTED_PRODUCTS, listedSneakerStatus, `id = ${listedSneakerId}`));
  }

  async update(listedSneakerId: number, listedSneaker: CreateListedSneakerPayload): Promise<ListedProduct> {
    return this.conn.query(formatUpdateRowsQuery(LISTED_PRODUCTS, listedSneaker, `id = ${listedSneakerId}`));
  }

  // soft delete the listed sneaker
  async remove(listedSneakerId: number) {
    return this.updateListedSneakerStatus(listedSneakerId, { prodStatus: 'deleted' });
  }

  async getById(listedSneakerId: Number) {
    const sql = `SELECT * from ${LISTED_PRODUCTS} WHERE id = ?`;

    return this.conn.query(sql, [listedSneakerId]);
  }
}

export default ListedSneakerService;
