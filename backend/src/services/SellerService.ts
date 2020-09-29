import mysqlPoolConnection from '../config/mysql';
import { doubleQuotedValue } from '../utils/formatDbQuery';
import { getSellersAvgRatingQuery } from '../utils/queries';
import { SellerEntity } from '../../../shared';

class SellerService implements SellerEntity {

  async getAvgRating(sellerId: number) {
    const poolConn = await mysqlPoolConnection()

    return poolConn
      .query(getSellersAvgRatingQuery('sellerRating', `WHERE sellerId = ${sellerId}`))
      .then((result) => (result.length == 1 ? result[0].sellerRating : 0));
  }

  async getSellersBySneakerNameSize(nameColorway: string, size: number) {
    const poolConn = await mysqlPoolConnection()

    // get sellers sneakers then order it by their rating in descending
    // order, then by askingPrice in ascending order
    const getSellersQuery = `
      SELECT U.id, username, email, L.askingPrice, L.id as listedProductId
        FROM Users U, ListedProducts L, Products P
          WHERE U.id = L.userId AND P.id = L.productId AND L.prodStatus = "listed" AND
            CONCAT(P.name, ' ', P.colorway) = ${doubleQuotedValue(nameColorway)} AND size = ${size}
    `;

    const sellersQuery = `
      SELECT id, username, email, askingPrice, listedProductId, rating FROM
        ( ${getSellersQuery} ) q1 LEFT JOIN
          ( ${getSellersAvgRatingQuery('rating')} ) q2
             ON (q1.id = q2.sellerId) ORDER BY rating DESC, askingPrice
    `;

    return poolConn.query(sellersQuery);
  };
}

export default SellerService;
