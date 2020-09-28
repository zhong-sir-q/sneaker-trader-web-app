import { PromisifiedConnection, getMysqlDb } from '../config/mysql';
import { formatInsertColumnsQuery, formateGetColumnsQuery, formatDeleteQuery } from '../utils/formatDbQuery';
import { WALLET } from '../config/tables';

import WalletEntity from '../../../shared/@types/domains/entities/WalletEntity';

class WalletService implements WalletEntity {
  private connection: PromisifiedConnection;

  constructor() {
    this.connection = getMysqlDb();
  }

  getBalanceByUserId(userId: number) {
    const getBalanceByUserIdQuery = formateGetColumnsQuery(WALLET, `userId = ${userId}`);

    return this.connection.query(getBalanceByUserIdQuery).then(async (queryResult) => {
      if (queryResult.length === 0) {
        await this.create(Number(userId));
        return 0;
      }

      return queryResult[0].balance;
    });
  }

  create = (userId: number) => this.connection.query(formatInsertColumnsQuery(WALLET, { userId }));

  delete = (userId: number) => this.connection.query(formatDeleteQuery(WALLET, `userId = ${userId}`));

  // amount cannot be negative
  // assume there is no limit
  topup(userId: number, amount: number) {
    const topupQuery = `UPDATE ${WALLET} SET balance = balance + ${amount} WHERE userId = ${userId}`;

    return this.connection.query(topupQuery);
  }

  // amount cannot be negative
  // NOTE: assume balance can go to negative
  decreaseBalance(userId: number, amount: number) {
    const decreaseBalanceQuery = `UPDATE ${WALLET} SET balance = balance - ${amount} WHERE userId = ${userId}`;

    return this.connection.query(decreaseBalanceQuery);
  }
}

export default WalletService;
