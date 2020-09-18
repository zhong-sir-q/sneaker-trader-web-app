import { PromisifiedConnection } from '../config/mysql';
import { USERS, PRODUCTS, LISTED_PRODUCTS } from '../config/tables';
import { doubleQuotedValue } from '../utils/formatDbQuery';

class SellersService {
  connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  getSellersBySneakerNameSize = async (nameColorway: string, size: number) => {
    // get sellers sneakers then order it by their rating in descending order
    const sellersQuery = `
      SELECT id, username, email, askingPrice, listedProductId, rating FROM
        (SELECT U.id, username, email, L.askingPrice, L.id as listedProductId
           FROM Users U, ListedProducts L, Products P
             WHERE U.id = L.userId AND P.id = L.productId AND L.prodStatus = "listed" AND
              CONCAT(P.name, ' ', P.colorway) = ${doubleQuotedValue(nameColorway)} AND size = ${size}) q1
         LEFT JOIN
           ( SELECT sellerId, ROUND(AVG(sellerRatingFromBuyer), 1) as rating FROM Transactions GROUP BY sellerId ) q2
             ON (q1.id = q2.sellerId) ORDER BY rating DESC, askingPrice
    `

    return this.connection.query(sellersQuery);
  };
}

export default SellersService;
