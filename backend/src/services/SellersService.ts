import { PromisifiedConnection, getMysqlDb } from '../config/mysql';
import { doubleQuotedValue } from '../utils/formatDbQuery';
import { getSellersAvgRatingQuery } from '../utils/queries';

class SellersService {
  connection: PromisifiedConnection;

  constructor() {
    this.connection = getMysqlDb();
  }

  getSellersBySneakerNameSize = async (nameColorway: string, size: number) => {
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

    return this.connection.query(sellersQuery);
  };
}

export default SellersService;
