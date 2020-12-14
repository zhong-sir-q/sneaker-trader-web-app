import { PromisifiedPool } from '../config/mysql';
import { getSellersAvgRatingQuery } from '../utils/queries';
import { SellerEntity, ListedSneakerSeller } from '../../../shared';

class SellerService implements SellerEntity {
  private conn: PromisifiedPool;

  constructor(connection: PromisifiedPool) {
    this.conn = connection;
  }

  async getSellersBySneakerNameSize(
    currentUserId: number,
    name: string,
    colorway: string,
    size: number
  ): Promise<ListedSneakerSeller[]> {
    // NOT L.userId = ? because the current user cannot see their own listing
    const getSellersQuery = `
      SELECT U.id, U.username, U.email, U.profilePicUrl, L.askingPrice, L.id as listedProductId,
        L.imageUrls as sneakerImgUrls FROM Users U, ListedProducts L, Products P WHERE U.id = L.userId
          AND NOT L.userId = ? AND P.id = L.productId AND L.prodStatus = "listed" AND
            P.name = ? AND P.colorway = ? AND size = ?
    `;

    // order it by their rating in descending order
    // then by askingPrice in ascending order
    const sellersQuery = `
      SELECT id, username, email, profilePicUrl, askingPrice, listedProductId, rating, sneakerImgUrls FROM
        ( ${getSellersQuery} ) q1 LEFT JOIN
          ( ${getSellersAvgRatingQuery('rating')} ) q2
             ON (q1.id = q2.sellerId) ORDER BY rating DESC, askingPrice
    `;

    return this.conn.query(sellersQuery, [currentUserId, name, colorway, size]);
  }
}

export default SellerService;
