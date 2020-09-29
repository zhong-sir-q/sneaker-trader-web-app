import { formatInsertColumnsQuery, formateGetColumnsQuery, doubleQuotedValue } from '../utils/formatDbQuery';

import mysqlPoolConnection from '../config/mysql';

import { AppSneaker, Sneaker } from '../../../shared';
import { PRODUCTS } from '../config/tables';

class SneakerService {
  async getByNamecolorwaySize(nameColorway: string, size: number | string): Promise<Sneaker> {
    const poolConn = await mysqlPoolConnection();

    const condition = `CONCAT(name, ' ', colorway) = ${doubleQuotedValue(nameColorway)} AND size = ${size}`;
    const getQuery = formateGetColumnsQuery(PRODUCTS, condition);
    const prod = await poolConn.query(getQuery);

    // has to be null instead of undefined
    // otherwise the app cannot deserialize it for some reason
    return prod.length === 1 ? prod[0] : null;
  }

  async create(sneaker: AppSneaker): Promise<number> {
    const poolConn = await mysqlPoolConnection();
    const createSneakerQuery = formatInsertColumnsQuery(PRODUCTS, sneaker);

    return poolConn.query(createSneakerQuery).then((res) => res.insertId);
  }
}

export default SneakerService;
