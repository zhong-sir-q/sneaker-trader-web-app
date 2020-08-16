import { Connection } from 'mysql';
import { DbSneaker, FetchDbDataCallback } from '../declarations';
import { formatInsertAllColumnsQuery } from '../utils/formatDbQuery';

class ProductService {
  connection: Connection;
  tableName: string;

  constructor(conn: Connection) {
    this.connection = conn;
    this.tableName = 'Products';
  }

  create(product: DbSneaker) {
    const createProductQuery = formatInsertAllColumnsQuery(this.tableName, product);
    this.connection.query(createProductQuery, (err) => {
      if (err) throw new Error(`Error creating the product in the database: ${err.message}`);
    });
  }

  getAllProducts(cb: FetchDbDataCallback) {
    const getAllProductsQuery = `SELECT * FROM ${this.tableName}`;
    this.connection.query(getAllProductsQuery, (err, rowsData) => {
      if (err) cb(err, undefined);
      else cb(undefined, rowsData);
    });
  }
}

export default ProductService;
