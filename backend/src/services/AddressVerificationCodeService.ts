import mysqlPoolConnection from '../config/mysql';
import { formateGetColumnsQuery, formatUpdateColumnsQuery, formatInsertColumnsQuery } from '../utils/formatDbQuery';
import { ADDRESS_VERIFICATION_CODE } from '../config/tables';

class AddressVerificationCodeService {
  async validateCode(userId: number, code: number) {
    const poolConn = await mysqlPoolConnection();
    const getCodeQuery = formateGetColumnsQuery(ADDRESS_VERIFICATION_CODE, `userId = ${userId}`);
    const res = await poolConn.query(getCodeQuery);

    if (res.length === 0) return false;

    return res[0].verificationCode === code;
  }

  async generateVerificationCode(userId: number): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const randSixDigitCode = Math.floor(100000 + Math.random() * 900000);

    const insertQuery = formatInsertColumnsQuery(ADDRESS_VERIFICATION_CODE, {
      userId,
      verificationCode: randSixDigitCode,
    });

    await poolConn.query(insertQuery);
  }
}

export default AddressVerificationCodeService;
