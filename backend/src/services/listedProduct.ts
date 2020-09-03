import { RequestHandler } from 'express';
import { ListedProduct, Sneaker, GallerySneakersType } from '../../../shared';
import { formatInsertColumnsQuery, formateGetColumnsQuery } from '../utils/formatDbQuery';
import { PromisifiedConnection } from '../config/mysql';
import ProductService from './product';

class ListedProductService {
  connection: PromisifiedConnection;
  tableName: string;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
    this.tableName = 'ListedProducts';
  }

  async formatGallerySneakers(listedProducts: ListedProduct[]): Promise<GallerySneakersType> {
    const result = {} as GallerySneakersType;
    const ProductServiceInstance = new ProductService(this.connection);

    for (const { productId, askingPrice, sold } of listedProducts) {
      if (sold === 1) continue;

      const sneaker: Sneaker = await ProductServiceInstance.getById(productId);

      const { name, colorWay, brand } = sneaker;
      const size = sneaker.size as number;

      // init the values
      if (!(brand in result)) result[brand] = {};
      if (!(size in result[brand])) result[brand][size] = {};

      // NOTE: this is a util function in the frontedn
      const colorName = (colorWay + name).split(' ').join('-');

      if (!(colorName in result[brand][size])) result[brand][size][colorName] = sneaker;
      // sneaker already exist, update the minimum asking price
      else {
        const { price } = result[brand][size][colorName];
        result[brand][size][colorName].price = Math.min(askingPrice, price!);
      }
    }

    return result;
  }

  getGallerySneakers: RequestHandler = async (_req, res, next) => {
    const getListedProductsQuery = formateGetColumnsQuery(this.tableName);

    try {
      const listedProducts: ListedProduct[] = await this.connection.query(getListedProductsQuery);
      const gallerySneakers = await this.formatGallerySneakers(listedProducts);

      res.json(gallerySneakers);
    } catch (err) {
      next(err);
    }
  };

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
