import { formatInsertRowsQuery, formatGetRowsQuery, doubleQuotedValue } from '../utils/formatDbQuery';

import mysqlPoolConnection from '../config/mysql';

import { PRODUCTS } from '../config/tables';

import { AppSneaker, Sneaker } from '../../../shared';
import SneakerEntity from '../../../shared/@types/domains/entities/SneakerEntity';

class SneakerService implements SneakerEntity {
  async getByNameColorwaySize(nameColorway: string, size: number): Promise<Sneaker> {
    const poolConn = await mysqlPoolConnection();

    const condition = `CONCAT(name, ' ', colorway) = ${doubleQuotedValue(nameColorway)} AND size = ${size}`;
    const getQuery = formatGetRowsQuery(PRODUCTS, condition);
    const prod = await poolConn.query(getQuery);

    // has to be null instead of undefined
    // otherwise the app cannot deserialize it for some reason
    return prod.length === 1 ? prod[0] : null;
  }

  async getFirstByNameColorway(nameColorway: string): Promise<Sneaker> {
    const poolConn = await mysqlPoolConnection();

    const getByNameColorwayQuery = formatGetRowsQuery(
      PRODUCTS,
      `CONCAT(name, ' ', colorway) = ${doubleQuotedValue(nameColorway)}`
    );

    const res = await poolConn.query(getByNameColorwayQuery);
    return res ? res[0] : null;
  }

  async create(sneaker: AppSneaker): Promise<number> {
    const poolConn = await mysqlPoolConnection();
    const dbSneaker = await this.getByNameColorwaySize(`${sneaker.name} ${sneaker.colorway}`, sneaker.size);

    if (dbSneaker) throw Error('Sneaker already exists');

    const createSneakerQuery = formatInsertRowsQuery(PRODUCTS, sneaker);

    return poolConn.query(createSneakerQuery).then((res) => res.insertId);
  }
}

export default SneakerService;
