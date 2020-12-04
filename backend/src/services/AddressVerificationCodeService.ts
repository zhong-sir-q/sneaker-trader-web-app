import mysqlPoolConnection from '../config/mysql';
import { formatInsertRowsQuery } from '../utils/formatDbQuery';
import { ADDRESS_VERIFICATION_CODE } from '../config/tables';

class AddressVerificationCodeService {
  async validateCode(userId: number, code: number) {
    const { verificationCode, id } = await this.getVerificationCode(userId);
    const isValid = verificationCode === code;

    if (isValid) this.onUseValidationCode(id);

    return isValid;
  }

  private async getVerificationCode(userId: number): Promise<{ id: number; verificationCode: number }> {
    const poolConn = await mysqlPoolConnection();

    const getCodeQuery = `
      SELECT verificationCode FROM ${ADDRESS_VERIFICATION_CODE} WHERE userId = ? AND used = 0
    `;

    const res = await poolConn.query(getCodeQuery, [userId]);

    return res.length ? res[0] : null;
  }

  private async onUseValidationCode(id: number): Promise<any> {
    const poolConn = await mysqlPoolConnection();

    const query = `
      UPDATE ${ADDRESS_VERIFICATION_CODE} SET used = 1 WHERE id = ?
    `;

    return poolConn.query(query, [id]);
  }

  // inserts a new code if the user does not already have one, otherwise create a new code
  async generateVerificationCode(userId: number): Promise<void> {
    const poolConn = await mysqlPoolConnection();

    const randSixDigitCode = Math.floor(100000 + Math.random() * 900000);

    const insertQuery = formatInsertRowsQuery(ADDRESS_VERIFICATION_CODE, {
      userId,
      verificationCode: randSixDigitCode,
    });

    await poolConn.query(insertQuery);
  }
}

export default AddressVerificationCodeService;
