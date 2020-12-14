import { formatGetRowsQuery, formatInsertRowsQuery } from '../utils/formatDbQuery';

import { PromisifiedPool } from '../config/mysql';
import { SNEAKER_NAMES, COLORWAYS, BRANDS } from '../config/tables';

import { HelperInfoType, HelperInfoServiceEntity } from '../../../shared';

class HelperInfoService implements HelperInfoServiceEntity {
  private conn: PromisifiedPool;

  constructor(connection: PromisifiedPool) {
    this.conn = connection;
  }

  private getTableName(info: HelperInfoType) {
    return info === 'sneakernames' ? SNEAKER_NAMES : info === 'colorways' ? COLORWAYS : BRANDS;
  }

  async get(info: HelperInfoType) {
    const tableName = this.getTableName(info);

    return this.conn.query(`SELECT * FROM ${tableName}`);
  }

  async create(info: HelperInfoType, payload: any) {
    const tableName = this.getTableName(info);

    return this.conn.query(formatInsertRowsQuery(tableName, payload));
  }
}

export default HelperInfoService;
