import { PromisifiedConnection } from '../config/mysql';

class SellersService {
  connection: PromisifiedConnection;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
  }

  getSellersBySneakerNameSize = async (sneakerName: string, size: number) => {
    // first get all unsold sneakers by name and size
    // then get the sellers information using the userId from subquery
    const sellersQuery = `SELECT userName, email, userSubQuery.askingPrice FROM Users resultQuery INNER JOIN (
        SELECT B.userId, B.askingPrice FROM Products as A INNER JOIN (
          SELECT userId, productId, askingPrice FROM ListedProducts WHERE sold = 0
        ) AS B ON A.id = B.productId
        WHERE CONCAT(A.name, ' ', A.colorWay) = '${sneakerName}' AND size = ${size}) userSubQuery
        ON resultQuery.id = userSubQuery.userId;`;

    return this.connection.query(sellersQuery);
  };
}

export default SellersService;
