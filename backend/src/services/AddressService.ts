import { AddressEntity, Address, AddrVerificationStatus } from '../../../shared';
import { formatGetRowsQuery, formatUpdateRowsQuery, formatInsertRowsQuery } from '../utils/formatDbQuery';

import { ADDRESS } from '../config/tables';
import mysqlPoolConnection from '../config/mysql';
import AddressVerificationCodeService from './AddressVerificationCodeService';

class AddressService implements AddressEntity {
  private readonly AddressVerificationCodeServiceInstance: AddressVerificationCodeService;

  constructor(AddrVerifyCodeServ: AddressVerificationCodeService) {
    this.AddressVerificationCodeServiceInstance = AddrVerifyCodeServ;
  }

  async addUserAddress(userId: number, addr: Address): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const addUserAddrQuery = formatInsertRowsQuery(ADDRESS, { ...addr, userId });
    await poolConn.query(addUserAddrQuery);
  }

  async onSuccessGenerateCode(userId: number): Promise<void> {
    await this.updateVerificationStatus(userId, 'in_progress');
  }

  async getAddressByUserId(userId: number): Promise<Address | null> {
    const poolConn = await mysqlPoolConnection();

    const getAddrQuery = formatGetRowsQuery(ADDRESS, `userId = ${userId}`);
    const result = await poolConn.query(getAddrQuery);

    return result.length === 0 ? null : result[0];
  }

  async validateCodeByUserID(userId: number, code: number): Promise<boolean> {
    const addr = await this.getAddressByUserId(userId);
    if (!addr) return false;

    const isCodeValid = await this.AddressVerificationCodeServiceInstance.validateCode(userId, code);
    if (isCodeValid) this.updateVerificationStatus(userId, 'verified');

    return isCodeValid;
  }

  async generateVerificationCode(userId: number): Promise<void> {
    this.AddressVerificationCodeServiceInstance.generateVerificationCode(userId);
  }

  async updateAddressByUserId(userId: number, addr: Address): Promise<void> {
    const poolConn = await mysqlPoolConnection();
    const updateQuery = formatUpdateRowsQuery(ADDRESS, addr, `userId = ${userId}`);

    await poolConn.query(updateQuery);
  }

  private async updateVerificationStatus(userId: number, status: AddrVerificationStatus) {
    const poolConn = await mysqlPoolConnection();

    const updateStatusQuery = formatUpdateRowsQuery(ADDRESS, { verificationStatus: status }, `userId = ${userId}`);
    poolConn.query(updateStatusQuery);
  }
}

export default AddressService;
