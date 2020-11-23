import { formatGetRowsQuery, formatInsertColumnsQuery } from '../utils/formatDbQuery';

import mysqlPoolConnection from '../config/mysql';
import { SNEAKER_NAMES, COLORWAYS, BRANDS } from '../config/tables';

import { HelperInfoType, HelperInfoServiceEntity } from '../../../shared';

class HelperInfoService implements HelperInfoServiceEntity {
  private getTableName(info: HelperInfoType) {
    return info === 'sneakernames' ? SNEAKER_NAMES : info === 'colorways' ? COLORWAYS : BRANDS;
  }

  async get(info: HelperInfoType) {
    const poolConn = await mysqlPoolConnection();
    const tableName = this.getTableName(info);

    return poolConn.query(formatGetRowsQuery(tableName));
  }

  async create(info: HelperInfoType, payload: any) {
    const poolConn = await mysqlPoolConnection();
    const tableName = this.getTableName(info);

    return poolConn.query(formatInsertColumnsQuery(tableName, payload));
  }
}

export default HelperInfoService;
