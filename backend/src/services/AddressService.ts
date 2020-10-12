import { AddressEntity, Address } from '../../../shared';
import { formateGetColumnsQuery, formatUpdateColumnsQuery, formatInsertColumnsQuery } from '../utils/formatDbQuery';

import { ADDRESS } from '../config/tables';
import mysqlPoolConnection from '../config/mysql';

class AddressService implements AddressEntity {
  async addUserAddress(userId: number, addr: Address): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const addUserAddrQuery = formatInsertColumnsQuery(ADDRESS, addr);
    await poolConn.query(addUserAddrQuery);
  }

  async getAddressByUserId(userId: number): Promise<Address | null> {
    const poolConn = await mysqlPoolConnection();

    const getAddrQuery = formateGetColumnsQuery(ADDRESS, `userId = ${userId}`);
    const result = await poolConn.query(getAddrQuery);

    return result.length === 0 ? null : result[0];
  }

  async validateCodeByUserID(userId: number, code: number): Promise<boolean> {
    const addr = await this.getAddressByUserId(userId);
    if (!addr) return false;

    return addr.verificationCode === code;
  }

  async generateAndUpdateVerifcationCode(userId: number): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const sixDigitCode = Math.floor(100000 + Math.random() * 900000);

    const updateQuery = formatUpdateColumnsQuery(ADDRESS, { verificationCode: sixDigitCode }, `userId = ${userId}`);
    await poolConn.query(updateQuery);
  }

  async updateAddressByUserId(userId: number, addr: Address): Promise<void> {
    const poolConn = await mysqlPoolConnection();
    const updateQuery = formatUpdateColumnsQuery(ADDRESS, addr, `userId = ${userId}`);

    await poolConn.query(updateQuery);
  }
}

export default AddressService;
