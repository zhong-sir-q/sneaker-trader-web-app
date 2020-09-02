import { RequestHandler } from "express";
import { Connection } from "mysql";
import { ListedProduct } from "../../../shared";
import { formatInsertColumnsQuery } from "../utils/formatDbQuery";

class ListedProductService {
  connection: Connection
  tableName: string

  constructor(conn: Connection) {
    this.connection = conn;
    this.tableName = 'ListedProducts'
  }

  handleCreate: RequestHandler = (req, res, next) => {
    const listedProduct: ListedProduct = req.body;

    const createProductQuery = formatInsertColumnsQuery(this.tableName, listedProduct);

    this.connection.query(createProductQuery, (err, queryResult) => {
      if (err) next(err);
      else res.json(queryResult);
    });
  }
}

export default ListedProductService;
