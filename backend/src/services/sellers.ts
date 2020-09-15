import { PromisifiedConnection } from '../config/mysql';
import { USERS, PRODUCTS, LISTED_PRODUCTS } from '../config/tables';
import { doubleQuotedValue } from '../utils/formatDbQuery';

class SellersService {
  connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  getSellersBySneakerNameSize = async (sneakerName: string, size: number) => {
    // first get all unsold sneakers by name and size
    // then get the sellers information
    const sellersQuery = `
      SELECT U.id, userName, email, L.askingPrice FROM ${USERS} U, ${LISTED_PRODUCTS} L, ${PRODUCTS} P 
        WHERE U.id = L.userId AND P.id = L.productId AND L.sold = 0 AND
          CONCAT(P.name, ' ', P.colorway) = ${doubleQuotedValue(sneakerName)} AND size = ${size}
    `

    return this.connection.query(sellersQuery);
  };
}

export default SellersService;
