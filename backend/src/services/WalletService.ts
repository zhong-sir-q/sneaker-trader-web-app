import mysqlPoolConnection from '../config/mysql';
import { formatInsertColumnsQuery, formatGetRowsQuery, formatDeleteQuery } from '../utils/formatDbQuery';
import { WALLET } from '../config/tables';

import WalletEntity from '../../../shared/@types/domains/entities/WalletEntity';

class WalletService implements WalletEntity {
  async getBalanceByUserId(userId: number): Promise<number | null> {
    const getBalanceByUserIdQuery = formatGetRowsQuery(WALLET, `userId = ${userId}`);
    const poolConn = await mysqlPoolConnection();

    const queryRes = await poolConn.query(getBalanceByUserIdQuery);

    return queryRes.length === 0 ? null : queryRes[0].balance;
  }

  async create(userId: number) {
    const poolConn = await mysqlPoolConnection();

    return poolConn.query(formatInsertColumnsQuery(WALLET, { userId }));
  }

  async delete(userId: number) {
    const poolConn = await mysqlPoolConnection();

    return poolConn.query(formatDeleteQuery(WALLET, `userId = ${userId}`));
  }

  // assume there is no limit
  async topup(userId: number, amount: number) {
    const poolConn = await mysqlPoolConnection();
    const topupQuery = `UPDATE ${WALLET} SET balance = balance + ${amount} WHERE userId = ${userId}`;

    return poolConn.query(topupQuery);
  }

  // NOTE: assume balance can go to negative
  async decreaseBalance(userId: number, amount: number) {
    const poolConn = await mysqlPoolConnection();
    const decreaseBalanceQuery = `UPDATE ${WALLET} SET balance = balance - ${amount} WHERE userId = ${userId}`;

    return poolConn.query(decreaseBalanceQuery);
  }
}

export default WalletService;
