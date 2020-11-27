import mysqlPoolConnection from '../config/mysql';
import { doubleQuotedValue } from '../utils/formatDbQuery';
import { getSellersAvgRatingQuery } from '../utils/queries';
import { SellerEntity, ListedSneakerSeller } from '../../../shared';

class SellerService implements SellerEntity {
  async getSellersBySneakerNameSize(
    currentUserId: number,
    nameColorway: string,
    size: number
  ): Promise<ListedSneakerSeller[]> {
    const poolConn = await mysqlPoolConnection();

    const getSellersQuery = `
      SELECT U.id, U.username, U.email, U.profilePicUrl, L.askingPrice, L.id as listedProductId,
        L.imageUrls as sneakerImgUrls FROM Users U, ListedProducts L, Products P WHERE U.id = L.userId
          AND NOT L.userId = ${currentUserId} AND P.id = L.productId AND L.prodStatus = "listed" AND
            CONCAT(P.name, ' ', P.colorway) = ${doubleQuotedValue(nameColorway)} AND size = ${size}
    `;

    // order it by their rating in descending order
    // then by askingPrice in ascending order
    const sellersQuery = `
      SELECT id, username, email, profilePicUrl, askingPrice, listedProductId, rating, sneakerImgUrls FROM
        ( ${getSellersQuery} ) q1 LEFT JOIN
          ( ${getSellersAvgRatingQuery('rating')} ) q2
             ON (q1.id = q2.sellerId) ORDER BY rating DESC, askingPrice
    `;

    return poolConn.query(sellersQuery);
  }
}

export default SellerService;
