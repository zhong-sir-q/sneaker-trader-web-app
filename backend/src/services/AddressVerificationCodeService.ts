import mysqlPoolConnection from '../config/mysql';
import { formatGetRowsQuery, formatInsertRowsQuery, formatUpdateRowsQuery } from '../utils/formatDbQuery';
import { ADDRESS_VERIFICATION_CODE } from '../config/tables';

class AddressVerificationCodeService {
  async validateCode(userId: number, code: number) {
    const poolConn = await mysqlPoolConnection();
    const getCodeQuery = formatGetRowsQuery(ADDRESS_VERIFICATION_CODE, `userId = ${userId}`);
    const res = await poolConn.query(getCodeQuery);

    if (res.length === 0) return false;

    return res[0].verificationCode === code;
  }

  private async getVerificationCode(userId: number): Promise<number> {
    const poolConn = await mysqlPoolConnection();

    const getCodeQuery = `
      SELECT verificationCode FROM ${ADDRESS_VERIFICATION_CODE} WHERE userId = ${userId}
    `;

    const res = await poolConn.query(getCodeQuery);

    return res.length ? res[0] : null;
  }

  // inserts a new code if the user does not already have one, otherwise create a new code
  async generateVerificationCode(userId: number): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const randSixDigitCode = Math.floor(100000 + Math.random() * 900000);

    const code = this.getVerificationCode(userId);

    if (code) {
      const updateQuery = formatUpdateRowsQuery(
        ADDRESS_VERIFICATION_CODE,
        { verificationCode: randSixDigitCode },
        `userId = ${userId}`
      );

      await poolConn.query(updateQuery);

      return;
    }

    const insertQuery = formatInsertRowsQuery(ADDRESS_VERIFICATION_CODE, {
      userId,
      verificationCode: randSixDigitCode,
    });

    await poolConn.query(insertQuery);
  }
}

export default AddressVerificationCodeService;
