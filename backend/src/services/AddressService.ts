import { AddressEntity, Address, AddrVerificationStatus } from '../../../shared';
import { formateGetColumnsQuery, formatUpdateColumnsQuery, formatInsertColumnsQuery } from '../utils/formatDbQuery';

import { ADDRESS } from '../config/tables';
import mysqlPoolConnection from '../config/mysql';
import AddressVerificationCodeService from './AddressVerificationCodeService';

class AddressService implements AddressEntity {
  AddressVerificationCodeServiceInstance: AddressVerificationCodeService;

  constructor(AddrVerifyCodeServ: AddressVerificationCodeService) {
    this.AddressVerificationCodeServiceInstance = AddrVerifyCodeServ;
  }

  async addUserAddress(userId: number, addr: Address): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const addUserAddrQuery = formatInsertColumnsQuery(ADDRESS, { ...addr, userId });
    await poolConn.query(addUserAddrQuery);
  }

  async onSuccessGenerateCode(userId: number): Promise<void> {
    await this.updateVerificationStatus(userId, 'in_progress');
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

    return this.AddressVerificationCodeServiceInstance.validateCode(userId, code);
  }

  async generateAndUpdateVerifcationCode(userId: number): Promise<void> {
    this.AddressVerificationCodeServiceInstance.generateAndUpdateVerifcationCode(userId);
  }

  async updateAddressByUserId(userId: number, addr: Address): Promise<void> {
    const poolConn = await mysqlPoolConnection();
    const updateQuery = formatUpdateColumnsQuery(ADDRESS, addr, `userId = ${userId}`);

    await poolConn.query(updateQuery);
  }

  private async updateVerificationStatus(userId: number, status: AddrVerificationStatus) {
    const poolConn = await mysqlPoolConnection();

    const updateStatusQuery = formatUpdateColumnsQuery(ADDRESS, { verificationStatus: status }, `userId = ${userId}`);
    poolConn.query(updateStatusQuery);
  }
}

export default AddressService;
