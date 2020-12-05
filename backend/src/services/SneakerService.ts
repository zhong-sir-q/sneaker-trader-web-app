import { formatInsertRowsQuery, formatGetRowsQuery, doubleQuotedValue } from '../utils/formatDbQuery';

import mysqlPoolConnection from '../config/mysql';

import { PRODUCTS, LISTED_PRODUCTS } from '../config/tables';

import { AppSneaker, Sneaker } from '../../../shared';
import SneakerEntity from '../../../shared/@types/domains/entities/SneakerEntity';

class SneakerService implements SneakerEntity {
  async getByNameColorwaySize(name: string, colorway: string, size: number): Promise<Sneaker> {
    const poolConn = await mysqlPoolConnection();

    const query = `
      SELECT * FROM ${PRODUCTS} WHERE name = ? AND colorway = ? AND size = ?
    `;

    const prod = await poolConn.query(query, [name, colorway, size]);

    // has to be null instead of undefined
    // otherwise the app cannot deserialize it for some reason
    return prod.length ? prod[0] : null;
  }

  async getFirstByNameColorway(name: string, colorway: string): Promise<Sneaker> {
    const poolConn = await mysqlPoolConnection();

    const getByNameColorwayQuery = `
      SELECT * FROM ${PRODUCTS} WHERE name = ? AND colorway = ?
    `;

    const res = await poolConn.query(getByNameColorwayQuery, [name, colorway]);

    return res.length ? res[0] : null;
  }

  async getFirstByNameBrandColorway(name: string, brand: string, colorway: string): Promise<Sneaker> {
    const poolConn = await mysqlPoolConnection();

    const getByNameColorwayQuery = `
      SELECT * FROM ${PRODUCTS} WHERE name = ? AND brand = ? AND colorway = ?
    `;

    const res = await poolConn.query(getByNameColorwayQuery, [name, brand, colorway]);

    return res.length ? res[0] : null;
  }

  async getGallerySneakers(): Promise<Sneaker[]> {
    const poolConn = await mysqlPoolConnection();

    const query = `
      SELECT P.* FROM ${PRODUCTS} P, ${LISTED_PRODUCTS} L WHERE L.prodStatus = 'listed'
        AND P.id = L.productId GROUP BY P.id, name, colorway, size
    `;

    return poolConn.query(query);
  }

  async create(sneaker: AppSneaker): Promise<number> {
    const poolConn = await mysqlPoolConnection();

    const { name, colorway, size } = sneaker;
    const dbSneaker = await this.getByNameColorwaySize(name, colorway, size);

    if (dbSneaker) throw Error('Sneaker already exists');

    const createSneakerQuery = formatInsertRowsQuery(PRODUCTS, sneaker);

    return poolConn.query(createSneakerQuery).then((res) => res.insertId);
  }

  async updateDisplayImage(id: number, imgUrl: string): Promise<any> {
    const poolConn = await mysqlPoolConnection();

    const updateQuery = `
      UPDATE ${PRODUCTS} SET imageUrls = '${imgUrl}' WHERE id = ?
    `;

    return poolConn.query(updateQuery, [id]);
  }
}

export default SneakerService;
