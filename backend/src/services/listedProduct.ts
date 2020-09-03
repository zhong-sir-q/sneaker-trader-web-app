import { RequestHandler } from 'express';
import { ListedProduct, Sneaker, GallerySneakersType, GetUserSizeGroupedPriceType } from '../../../shared';
import { formatInsertColumnsQuery, formateGetColumnsQuery, doubleQuotedValue } from '../utils/formatDbQuery';
import { PromisifiedConnection } from '../config/mysql';
import ProductService from './product';
import ProductsService from './products';

class ListedProductService {
  connection: PromisifiedConnection;
  tableName: string;

  constructor(conn: PromisifiedConnection) {
    this.connection = conn;
    this.tableName = 'ListedProducts';
  }

  // GallerySneakersType is grouped first by brands, then shoe size, then color name
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

      // NOTE: this is a util function in the frontend
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

  async getAll(): Promise<ListedProduct[]> {
    const getListedProductsQuery = formateGetColumnsQuery(this.tableName);

    return await this.connection.query(getListedProductsQuery);
  }

  getGallerySneakers: RequestHandler = async (_req, res, next) => {
    try {
      const listedProducts = await this.getAll();
      const gallerySneakers = await this.formatGallerySneakers(listedProducts);
      res.json(gallerySneakers);
    } catch (err) {
      next(err);
    }
  };

  /**
   * @param colorNamme space separated name, e.g. Black Kobe 4
   *
   * 1. Filter the products by the colorName
   * 2. Remove the products that is not listed else it is listed,
   * then format the data into UserSizeGroupedPriceType
   */
  getUserSizeGroupedPriceByColorName = async (colorName: string): Promise<GetUserSizeGroupedPriceType> => {
    const ProductsServiceInstance = new ProductsService(this.connection);
    const filterCondition = `CONCAT(colorWay, ' ', name) = ${doubleQuotedValue(colorName)}`;
    const filteredProducts = await ProductsServiceInstance.getByCondition(filterCondition);

    if (filteredProducts.length === 0) throw new Error('Sneakers with this color name were not found');

    const userSizeGroupedPrice = this.removeSoldProducts(filteredProducts);

    return userSizeGroupedPrice;
  };

  // this function inserts the relevant information of ONE listedProduct into the result object
  formatListedProductsByColorName(toUpdateObj: GetUserSizeGroupedPriceType, listedProduct: ListedProduct, shoeSize: number) {
    const { askingPrice, userId } = listedProduct;

    if (!(shoeSize in toUpdateObj.payload)) toUpdateObj.payload[shoeSize] = { [userId]: askingPrice, lowestAsk: askingPrice };
    else {
      toUpdateObj.payload[shoeSize][userId] = askingPrice;
      toUpdateObj.payload[shoeSize].lowestAsk = Math.min(askingPrice, toUpdateObj.payload[shoeSize].lowestAsk);
    }

    // NOTE: the price here denote the lowest asking price overall
    if (!toUpdateObj.price) toUpdateObj.price = askingPrice;
    else toUpdateObj.price = Math.min(toUpdateObj.price, askingPrice);
  }

  // remove sold products and return the grouped prices by user and size result
  removeSoldProducts = async (filteredProducts: Sneaker[]): Promise<GetUserSizeGroupedPriceType> => {
    // insert all the values from 1 sneaker into the products first
    // they will be used as default values once sent to the frontend
    const result = { ...filteredProducts[0], payload: {} } as GetUserSizeGroupedPriceType;

    for (const filtered of filteredProducts) {
      const listedProduct = await this.getByProductId(filtered.id!);
      if (!listedProduct || listedProduct.sold) continue;

      const size = filtered.size!;

      this.formatListedProductsByColorName(result, listedProduct, size);
    }

    return result;
  };

  async getByProductId(id: number): Promise<ListedProduct> {
    const getByProductIdQuery = formateGetColumnsQuery(this.tableName, `productId = ${id}`);
    const result = await this.connection.query(getByProductIdQuery);

    return result.length === 0 ? undefined : result[0];
  }

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
