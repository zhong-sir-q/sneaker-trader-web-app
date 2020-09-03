import { RequestHandler } from 'express';
import { ListedProduct } from '../../../shared';
import { formatInsertColumnsQuery } from '../utils/formatDbQuery';
import { PromisifiedConnection } from '../config/mysql';

// type GallerySneakersType = {
//   [brand: string]: {
//     [size: number]: { [colorName: string]: Sneaker & { lowestAskingPrice: number } };
//   };
// };

class ListedProductService {
  connection: PromisifiedConnection;
  tableName: string;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
    this.tableName = 'ListedProducts';
  }

  formatGallerySneakers(_listedProducts: ListedProduct[]) {}

  getGallerySneakers: RequestHandler = (_req, res, next) => {};

  handleCreate: RequestHandler = async (req, res, next) => {
    const listedProduct: ListedProduct = req.body;

    const createProductQuery = formatInsertColumnsQuery(this.tableName, listedProduct);

    try {
      const result = await this.connection.query(createProductQuery);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };
}

export default ListedProductService;
