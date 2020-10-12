import mysqlPoolConnection from '../config/mysql';
import { formateGetColumnsQuery, formatUpdateColumnsQuery } from '../utils/formatDbQuery';
import { ADDRESS_VERIFICATION_CODE } from '../config/tables';

class AddressVerificationCodeService {
  async validateCode(userId: number, code: number) {
    const poolConn = await mysqlPoolConnection();
    const getCodeQuery = formateGetColumnsQuery(ADDRESS_VERIFICATION_CODE, `userId = ${userId}`);
    const res = await poolConn.query(getCodeQuery);

    if (res.length === 0) return false;

    return res[0].verificationCode === code;
  }

  async generateAndUpdateVerifcationCode(userId: number): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const randSixDigitCode = Math.floor(100000 + Math.random() * 900000);

    const updateQuery = formatUpdateColumnsQuery(
      ADDRESS_VERIFICATION_CODE,
      { verificationCode: randSixDigitCode },
      `userId = ${userId}`
    );
    await poolConn.query(updateQuery);
  }
}

export default AddressVerificationCodeService;
