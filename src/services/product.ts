import { Connection } from 'mysql';
import { DbSneaker } from '../declarations';
import { formatInsertAllColumnsQuery } from '../utils/formatDbQuery';

class ProductService {
  connection: Connection;

  constructor(conn: Connection) {
    this.connection = conn;
  }

  create(product: DbSneaker) {
    const createProductQuery = formatInsertAllColumnsQuery('Products', product);
    this.connection.query(createProductQuery, (err) => {
      if (err) throw new Error(`Error creating the product in the database: ${err.message}`);
    });
  }
}

export default ProductService
